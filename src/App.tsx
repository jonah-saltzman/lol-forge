import React, {useContext, createContext, useState, useEffect} from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'
import Spinner from './components/Spinner'

export const initialContext: Auth = {
	loggedIn: false,
	email: null,
	token: null,
}

export const authContext = createContext<AuthContext | null>(null)

const App = () => {
    const [auth, setAuth] = useState(initialContext)
    useEffect(() => {
        const auth = window.localStorage.getItem('auth')
        if (auth) {
            const authData = JSON.parse(auth) as Auth
            setAuth(authData)
            toast(`Welcome back, ${authData.email}`)
        }
    },[])
	return (
		<authContext.Provider value={{ auth, setAuth }}>
			<ToastContainer />
				<Nav />
				<div className='game'></div>
		</authContext.Provider>
	)   
}

export default App