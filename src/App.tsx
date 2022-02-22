import React, { createContext, useState, useEffect, useReducer} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Nav from './Nav'
import { Champ } from './classes/champ'
import { Item } from './classes/item'
import { getChamps, getItems } from './api/info'
import Builder from './components/Builder'
import BuildList from './components/BuildList'
import { Col, Container, Row } from 'react-bootstrap'
import { Build } from './classes/build'
import { getAllBuilds } from './api/builds'
import * as context from './hooks/context/createContext'
import buildReducer from './hooks/context/buildReducer'
import { Actions } from './declarations/enums'

export const initialContext: Auth = {
	loggedIn: false,
	email: null,
	token: null,
}

const App = () => {
    const [auth, setAuth] = useState(initialContext)
    const [champs, setChamps] = useState<Champ[]>([])
    const [items, setItems] = useState<Item[]>([])
    const [builds, setBuilds] = useState<Build[]>([])
    const [loaded, setLoaded] = useState(false)
    const [build, dispatch] = useReducer(buildReducer, null)
    const [selectedChamp, setSelectedChamp] = useState<Champ>(null)
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!build) return
        const listIndex = builds.findIndex(b => b.buildId === build.buildId)
        if (listIndex === -1) {
            console.error('build not in list')
        } else {
            build.updateHash()
            builds[listIndex].updateHash()
            if (build.hash !== builds[listIndex].hash) {
                const newArray = [...builds]
                newArray[listIndex] = build
                setBuilds(newArray)
            }
        }
    }, [build])

    // item & champ state setters & getters
    const itemNames = () => items.map(item => item.itemName)
    const itemIds = () => items.map(item => item.itemId)
    const champNames = () => champs.map(champ => champ.champName)
    const champIds = () => champs.map(champ => champ.champId)
    const addChampStats = (champ: number, stats: OneStat[]): Champ => {
        const newArr = [...champs]
        const i = newArr.findIndex((ele) => ele.champId === champ)
        const newChamp = newArr[i].addStats(stats)
        newArr[i] = newChamp
        setChamps(newArr)
        return newChamp
    }
    const addItemStats = (item: number, stats: OneStat[]): Item => {
        const newArr = [...items]
        const i = newArr.findIndex((ele) => ele.itemId === item)
        const newItem = newArr[i].addStats(stats)
        setItems(newArr)
        return newItem
    }

    const selectChamp = (id: number) => {
        const newChamp = champs.find(champ => champ.champId === id)
        setSelectedChamp(newChamp)
        if (build) {
            if (build.champ.champId === newChamp.champId) return
            dispatch({type: Actions.ChangeChamp, newChamp })
        }
    }

    const newBuild = async (name: string) => {
        const champC: ChampContext = { champs, addChampStats, champIds, champNames }
        const itemC: ItemContext = { items, addItemStats, itemIds, itemNames }
        if (!selectedChamp) {
            toast('Select a champ to create a build')
            return
        }
        const newBuild = new Build({items: [], buildName: name, champId: selectedChamp.champId, champStats: [] }, champC, itemC, selectedChamp, [])
        if (auth.loggedIn) {
            if (await newBuild.save(auth.token)) {
                refreshBuilds(newBuild.buildId)
            }
        }
    }

    const refreshBuilds = (selected?: number) => {
        if (!auth.loggedIn) return
        setLoading(true)
        const champC: ChampContext = { champs, addChampStats, champIds, champNames }
        const itemC: ItemContext = { items, addItemStats, itemIds, itemNames }
        getAllBuilds(auth.token).then((infos) => {
            const newBuilds = infos.map(info => new Build(info, champC, itemC))
            setBuilds(newBuilds)
        }).then(() => {
            if (selected) {
                const found = builds.find((build) => build.buildId === selected)
                if (!found) toast('Unknown error creating build')
                else {
                    toast(`Created build ${found.buildName}`)
                    dispatch({type: Actions.Swap, build: found})
                }
            }
            setLoading(false)
        })
    }

    const loadedAll = () => {
        setLoaded(true)
    }

    useEffect(() => {
			getChamps().then(setChamps).then(getItems).then(setItems).then(loadedAll)
			const savedAuth = window.localStorage.getItem('auth')
			if (savedAuth) {
				const authData = JSON.parse(savedAuth) as Auth
				setAuth(authData)
				toast(`Welcome back, ${authData.email}`)
			}
		}, [])
    
    useEffect(() => {
        if (!auth.loggedIn || !champs.length || !items.length || !loaded) {
            setBuilds([])
        } else {
            refreshBuilds()
        }
    }, [loaded])

    useEffect(() => {
        if (!auth.loggedIn) {
            setBuilds([])
            setSelectedChamp(null)
            dispatch({type: Actions.Swap, build: null})
        }
    }, [auth.loggedIn])

	return (
		<context.authContext.Provider value={{ auth, setAuth }}>
			<context.champContext.Provider
				value={{ champs, addChampStats, champIds, champNames }}>
				<context.itemContext.Provider
					value={{ items, addItemStats, itemIds, itemNames }}>
					<ToastContainer />
					<Nav />
					<Container fluid>
						<Row>
							<context.buildContext.Provider
								value={{ selected: build, dispatch }}>
								{auth.loggedIn ? (
									<Col className='overflow-visible' xs={12} md={1}>
										<BuildList
											authed={auth.loggedIn}
                                            loading={loading}
                                            newBuild={newBuild}
                                            builds={builds}
                                            setBuilds={setBuilds}
										/>
									</Col>
								) : null}
								<Col className='main-col' xs={12} md={auth.loggedIn ? 11 : 12}>
									<Builder newChamp={selectChamp} />
								</Col>
							</context.buildContext.Provider>
						</Row>
					</Container>
				</context.itemContext.Provider>
			</context.champContext.Provider>
		</context.authContext.Provider>
	)   
}

export default App