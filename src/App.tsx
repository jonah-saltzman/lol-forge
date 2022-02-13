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

export const authContext = createContext<AuthContext | null>(null)
export const champContext = createContext<Champ[] | null>(null)

const App = () => {
    const [auth, setAuth] = useState(initialContext)
    const [allChamps, setAllChamps] = useState<Champ[]>(null)
    useEffect(() => {
        const auth = window.localStorage.getItem('auth')
        getChamps()
					.then((champs) => setAllChamps(champs))
					.then(() => console.log('got all champs'))
        if (auth) {
            const authData = JSON.parse(auth) as Auth
            setAuth(authData)
            toast(`Welcome back, ${authData.email}`)
        }
    },[])
	return (
		<authContext.Provider value={{ auth, setAuth }}>
			<champContext.Provider value={allChamps}>
				<ToastContainer />
				<Nav />
				<div className='main'><Main /></div>
			</champContext.Provider>
		</authContext.Provider>
	)   
}

export default App