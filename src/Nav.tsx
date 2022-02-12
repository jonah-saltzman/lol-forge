import React from "react";
import { toast } from "react-toastify";
import {
    Button,
	Navbar
} from 'react-bootstrap'

const Nav = () => {
    const demoToast = () => {
        toast('Login disabled in Demo Mode')
    }
    return (
			<Navbar sticky='top' className='nav'>
				<Navbar.Brand className='text-white navbrand'>
					<span className='mega'>Mega</span>Max{' '}
					<span className='subhead'>Tic-Tac-Toe</span>
				</Navbar.Brand>
				<Button onClick={demoToast} className='button nav-right'>Login</Button>
			</Navbar>
		)
}

export default Nav