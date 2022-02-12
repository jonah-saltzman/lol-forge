import React, { createRef, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authContext } from "./App";
import {
    Button,
	Navbar,
    Modal,
    Container,
    Form,
    CloseButton
} from 'react-bootstrap'

interface NavProps {
    toggle?: () => void
}

const Nav = ({toggle}: NavProps) => {
    const {auth, setAuth} = useContext(authContext)
    const {loggedIn, token, email} = auth
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirm, setConfirm] = useState('')
    const [show, setShow] = useState(false)
    const [changePass, setChangePass] = useState(false)
    const [signIn, setSignIn] = useState(true)
    const [title, setTitle] = useState(loggedIn ? email : signIn ? 'Sign In' : 'Sign Up')
    const [listener, setListener] = useState(null)
    const modalRef = createRef()

    const toggleAuth = () => {
		setSignIn(!signIn)
	}

    const handleChangePass = () => {
        return
    }

    const signOut = () => {

    }

    const recursiveCheck = (element: Element, target: Element): boolean => {
        if (element === target) {
            return true
        }
        const children = element?.children
        if (!children || children.length === 0) {
            return false
        } else {
            const array: boolean[] = []
            for (const i in children) {
                if (children[i] === target) {
                    return true
                } else {
                    array.push(recursiveCheck(children[i], target))
                }
            }
            return array.some(element => element)
        }
    }

    const onClick = (event: MouseEvent) => {
        console.log('onClick, show: ', show)
        const content = document.getElementsByClassName('modal-content')[0]
        const clicked = event.target as Element
        for (const i in content.children) {
            if (recursiveCheck(content, clicked)) {
                console.log('recursive TRUE')
                return
            }
        }
        setShow(false)
        removeEventListener('click', onClick)
    }

    const closeButton = () => {
        removeEventListener('click', onClick)
        setShow(false)
    }

    const changePassForm = (
			<Container className='flex'>
				<Form onSubmit={handleChangePass} className='flex-v pass-form'>
					<input
						className='input mb-3'
						type='password'
						name='oldPass'
						id='oldPass'
						value={oldPass}
						onChange={(e) => setOldPass(e.target.value)}
						placeholder='Current password'
					/>
					<input
						className='input mb-3'
						type='password'
						name='newwPass'
						id='newPass'
						value={newPass}
						onChange={(e) => setNewPass(e.target.value)}
						placeholder='New password'
					/>
					<input
						className='input mb-3'
						type='password'
						name='newPassConf'
						id='newPassConf'
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						placeholder='Confirm new password'
					/>
					<div className='center-item'>
						<Button onClick={() => setChangePass(false)} className='btn-secondary mb-3'>
							Cancel
						</Button>
						<Button className='ml-3 mb-3' color='primary' type='submit'>
							Change Password
						</Button>
					</div>
				</Form>
			</Container>
		)

		const authModal = (
			<Modal
				keyboard={false}
				backdrop={true}
				show={show}
				ref={modalRef}
				onEntered={() => {
					addEventListener('click', onClick)
				}}>
				<Modal.Header className='account-title'>
					<CloseButton className='close-modal' onClick={closeButton} />
					<Modal.Title className='text-large'>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{changePass ? changePassForm : null}
					<div className='flex'>
						<div className='center-item'>
							{loggedIn ? (
								changePass ? (
									<Button onClick={signOut} className={'btn-warning ml-3'}>
										Logout
									</Button>
								) : (
									<Button
										color='primary'
										onClick={() => setChangePass(!changePass)}>
										Change Password
									</Button>
								)
							) : null}
						</div>
					</div>
				</Modal.Body>
			</Modal>
		)
    
    return (
			<Navbar sticky='top' className='nav'>
				<Navbar.Brand className='text-white navbrand'>
					<span className='mega'>LoL</span>Forge{' '}
					<span className='subhead'>{'League of Legends Builds & Stats'}</span>
				</Navbar.Brand>
				{loggedIn ? (
					<span onClick={() => setShow(true)} className='text-white text-large link'>
						Account
					</span>
				) : (
					<Button className='text-white text-large' onClick={() => setShow(true)}>
						Login
					</Button>
				)}
                {authModal}
			</Navbar>
		)
}

export default Nav