import React, {useContext, createContext, useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'
import { Champ } from './classes/champ'
import { Item } from './classes/item'
import { getChamps, getItems } from './api/info'
import Main from './components/Main'

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

    useEffect(() => {
        getChamps().then(setChamps).then(getItems).then(setItems)
        const auth = window.localStorage.getItem('auth')
        if (auth) {
            const authData = JSON.parse(auth) as Auth
            setAuth(authData)
            toast(`Welcome back, ${authData.email}`)
        }
    },[])
	return (
		<authContext.Provider value={{ auth, setAuth }}>
			<champContext.Provider
				value={{ champs, addChampStats, champIds, champNames }}>
				<itemContext.Provider
					value={{ items, addItemStats, itemIds, itemNames }}>
					<ToastContainer />
					<Nav />
					<div className='main'>
						<Main />
					</div>
				</itemContext.Provider>
			</champContext.Provider>
		</authContext.Provider>
	)   
}

export default App