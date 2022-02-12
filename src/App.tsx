import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Nav from './Nav'
import Board from './components/Board'

const App = () => {
	return (
		<>
			<ToastContainer />
			<Nav />
			<div className='game'>
				<Board />
			</div>
		</>
	)   
}

export default App