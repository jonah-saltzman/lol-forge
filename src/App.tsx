import React, {useContext, createContext, useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'
import Spinner from './components/Spinner'
import { Champ } from './classes/champ'
import { getChamps } from './api/info'
import Main from './components/Main'

export const initialContext: Auth = {
	loggedIn: false,
	email: null,
	token: null,
}

type ChampObject = {
    [key: number]: Champ
}

interface ChampContext {
    champs: ChampObject
    addStats: (champ: Champ, stats: OneStat[]) => void
    champNames: () => string[]
    champIds: () => number[]
}

export const authContext = createContext<AuthContext | null>(null)
export const champContext = createContext<ChampContext | null>(null)

const App = () => {
    const [auth, setAuth] = useState(initialContext)
    const [champs, setChamps] = useState<ChampObject>({})
    const addStats = (champ: Champ, stats: OneStat[]): void => {
        const newChamp = champ.addStats(stats)
        const newObj = {...champs}
        newObj[champ.champId] = newChamp
        setChamps(newObj)
    }
    const champNames = () => {
        return Object.values(champs).map(champ => champ.champName)
    }
    const champIds = () => {
        return Object.keys(champs).map(id => parseInt(id))
    }
    useEffect(() => {
        const auth = window.localStorage.getItem('auth')
        getChamps()
					.then((champs) => {
                        let obj: ChampObject = {}
                        for (const champ of champs) {
                            obj[champ.champId] = champ
                        }
                        setChamps(obj)
                    })
					.then(() => console.log('got all champs'))
        if (auth) {
            const authData = JSON.parse(auth) as Auth
            setAuth(authData)
            toast(`Welcome back, ${authData.email}`)
        }
    },[])
	return (
		<authContext.Provider value={{ auth, setAuth }}>
			<champContext.Provider value={{champs, addStats, champIds, champNames}}>
				<ToastContainer />
				<Nav />
				<div className='main'><Main /></div>
			</champContext.Provider>
		</authContext.Provider>
	)   
}

export default App