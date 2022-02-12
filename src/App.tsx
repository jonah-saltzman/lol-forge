import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'

const App = () => {
	return (
		<>
			<ToastContainer />
			<Nav />
			<div className='game'>
			</div>
		</>
	)   
}

export default App