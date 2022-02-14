import React, {useContext, createContext, useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'
import { Champ } from './classes/champ'
import { Item } from './classes/item'
import { getChamps, getItems } from './api/info'
import Builder from './components/Builder'
import BuildList from './components/BuildList'
import { Col, Container, Row } from 'react-bootstrap'
import { Build } from './classes/build'
import { getAllBuilds } from './api/builds'

export const initialContext: Auth = {
	loggedIn: false,
	email: null,
	token: null,
}

export interface ChampContext {
    champs: Champ[]
    addChampStats: (champ: number, stats: OneStat[]) => Champ
    champNames: () => string[]
    champIds: () => number[]
}

export interface ItemContext {
    items: Item[]
    addItemStats: (item: number, stats: OneStat[]) => Item
    itemNames: () => string[]
    itemIds: () => number[]
}

export const authContext = createContext<AuthContext | null>(null)
export const champContext = createContext<ChampContext | null>(null)
export const itemContext = createContext<ItemContext | null>(null)

const App = () => {
    const [auth, setAuth] = useState(initialContext)
    const [champs, setChamps] = useState<Champ[]>([])
    const [items, setItems] = useState<Item[]>([])
    const [builds, setBuilds] = useState<Build[]>([])
    const [loaded, setLoaded] = useState(false)

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

    const refreshBuilds = () => {
        if (!auth.loggedIn) return
        const champC: ChampContext = { champs, addChampStats, champIds, champNames }
        const itemC: ItemContext = { items, addItemStats, itemIds, itemNames }
        getAllBuilds(auth.token).then((infos) => {
            const newBuilds = infos.map(info => new Build(info, champC, itemC))
            setBuilds(newBuilds)
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

    useEffect(() => {
        if (!auth.loggedIn || !champs.length || !items.length || !loaded) {
            setBuilds([])
        } else {
            refreshBuilds()
        }
    }, [loaded])

    const selectBuild = (id: number) => {
        return
    }

	return (
		<authContext.Provider value={{ auth, setAuth }}>
			<champContext.Provider
				value={{ champs, addChampStats, champIds, champNames }}>
				<itemContext.Provider
					value={{ items, addItemStats, itemIds, itemNames }}>
					<ToastContainer />
					<Nav />
					<Container fluid>
                        <Row>
                            <Col xs={12} md={2}>
                                <BuildList builds={builds} select={selectBuild} />
                            </Col>
                            <Col xs={12} md={10}>
                                <Builder />
                            </Col>
                        </Row>
                    </Container>
				</itemContext.Provider>
			</champContext.Provider>
		</authContext.Provider>
	)   
}

export default App