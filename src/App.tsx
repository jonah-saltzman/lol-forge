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

    const guestBuild = (build: Build) => {
        //setSelectedBuild(build)
        setSelectedChamp(build.champ)
    }

    const setSelectedBuild = (buildId: number): void => {
        const found = builds.find(build => build.buildId === buildId)
        if (!found) {
            refreshBuilds(buildId)
        } else {
            dispatch({type: Actions.Swap, build: found})
        }
    }

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
        console.log('selecting champ: ', id)
        setSelectedChamp(champs.find(champ => champ.champId === id))
    }

    const refreshBuilds = (selected?: number) => {
        if (!auth.loggedIn) return
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
                    setSelectedBuild(selected)
                }
            }
        })
    }

    useEffect(() => {
        getChamps().then(setChamps).then(getItems).then(setItems).then(loadedAll)
        const savedAuth = window.localStorage.getItem('auth')
        if (savedAuth) {
            const authData = JSON.parse(savedAuth) as Auth
            setAuth(authData)
            toast(`Welcome back, ${authData.email}`)
        }
    },[])

    const loadedAll = () => {
        setLoaded(true)
    }

    // useEffect(() => {
    //     refreshBuilds()
    // }, [auth.loggedIn])

    useEffect(() => {
        if (!auth.loggedIn || !champs.length || !items.length || !loaded) {
            setBuilds([])
        } else {
            refreshBuilds()
        }
    }, [loaded])

    // export interface BuildInfo {
	// 		buildName?: string
	// 		buildId?: number
	// 		champId: number
	// 		champStats: OneStat[]
	// 		items: ItemInfo[]
	// 	}
    const newBuild = async (name: string) => {
        const champC: ChampContext = { champs, addChampStats, champIds, champNames }
        const itemC: ItemContext = { items, addItemStats, itemIds, itemNames }
        if (!selectChamp) {
            toast('Select a champ to create a build')
            return
        }
        console.log('creating build from champ: ')
        console.log(selectedChamp)
        const newBuild = new Build({items: [], buildName: name, champId: selectedChamp.champId, champStats: [] }, champC, itemC, selectedChamp, [])
        if (auth.loggedIn) {
            if (await newBuild.save(auth.token)) {
                refreshBuilds(newBuild.buildId)
            }
        }
    }

    useEffect(() => {
        if (!auth.loggedIn) {
            setBuilds([])
            setSelectedBuild(null)
            setSelectedChamp(null)
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
									<Col xs={12} md={1}>
										<BuildList
											authed={auth.loggedIn}
											addBuild={newBuild}
											builds={builds}
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