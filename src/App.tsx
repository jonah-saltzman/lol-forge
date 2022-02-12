import React, {useContext, createContext, useState} from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'
import Spinner from './components/Spinner'

const initialContext: Auth = {
	loggedIn: false,
	email: null,
	token: null,
}

export const authContext = createContext<AuthContext | null>(null)

const App = () => {
    const [auth, setAuth] = useState(initialContext)
	return (
		<authContext.Provider value={{ auth, setAuth }}>
			<ToastContainer />
			<Spinner>
				<Nav />
				<div className='game'></div>
			</Spinner>
		</authContext.Provider>
	)   
}

export default App