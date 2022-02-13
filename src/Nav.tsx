import React, { createRef, FormEventHandler, useContext, useEffect, useState } from "react";
import api from "./api/auth";
import { toast } from "react-toastify";
import { authContext, initialContext } from "./App";
import {
    Button,
	Navbar,
    Modal,
    Container,
    Form,
    CloseButton,
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
    const [newEmail, setEmail] = useState('')
    const [staySignedIn, setStaySignedIn] = useState(true)
    const [show, setShow] = useState(false)
    const [changePass, setChangePass] = useState(false)
    const [signIn, setSignIn] = useState(true)
    const [title, setTitle] = useState(loggedIn ? email : signIn ? 'Sign In' : 'Sign Up')

    useEffect(() => {
        setTitle(loggedIn ? email : signIn ? 'Sign In' : 'Sign Up')
    }, [loggedIn, signIn])

    const toggleAuth = () => {
		setSignIn(!signIn)
	}

    const signOut = () => {
        api.signOut(token)
        toast(`Goodbye, ${email}`)
        setAuth(initialContext)
        setEmail('')
        reset()
        setShow(false)
        setSignIn(true)
        window.localStorage.removeItem('auth')
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
        const content = document.getElementsByClassName('modal-content')[0]
        const clicked = event.target as Element
        if (recursiveCheck(content, clicked)) {
            return
        }
        setShow(false)
        removeEventListener('click', onClick)
    }

    const closeButton = () => {
        removeEventListener('click', onClick)
        setShow(false)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        toast.dismiss()
        const form = validate(loggedIn ? 'change' : signIn ? 'signin' : 'signup')
        if (!form) {
            toast('Please fix errors in form')
            return
        } else {
            if (loggedIn) {
                const res = await api.changePassword(form as ChangePass)
                if (res) {
                    toast('Successfully changed password')
                    reset()
                    setEmail('')
                    setChangePass(false)
                } else {
                    toast('Current password incorrect')
                    reset()
                }
            } else if (signIn) {
                const res = await api.login(form as Login)
                if (res.loggedIn) {
                    login(res)
                } else {
                    toast(res.message)
                    reset()
                }
            } else {
                if (await api.signUp(form as Login)) {
                    const res = await api.login(form as Login)
                    if (res.loggedIn) {
                        login(res)
                    } else {
                        toast('Account created but login failed')
                        setSignIn(true)
                        reset()
                    }
                } else {
                    toast('Failed to create account')
                    reset()
                }
            }
        }
    }

    const login = (res: LoginResponse) => {
        setAuth(res)
        toast(res.message)
        setShow(false)
        reset()
        setEmail('')
        if (staySignedIn) {
            const str = JSON.stringify(res)
            window.localStorage.setItem('auth', str)
        }
    }

    const reset = () => {
        setOldPass('')
        setNewPass('')
        setConfirm('')
        setStaySignedIn(true)
    }

    const validate = (type: AuthType): ChangePass | Login | null => {
        switch (type) {
            case 'signin':
                if (!newEmail || !newPass) return null
                return {email: newEmail, password: newPass} as Login
            case 'signup':
                if (!newEmail || !newPass || !confirm || confirm !== newPass) return null
                return {email: newEmail, password: newPass} as Login
            case 'change':
                if (!oldPass || !newPass || !confirm || confirm !== newPass) return null
                return {oldPass, newPass, token} as ChangePass
        }
    }

        const loginForm = (
					<Form className='formcard flex-v auth-form' onSubmit={handleSubmit}>
						<Form.Group hidden={loggedIn} className='mt-2'>
							<input
								className='input'
								type='email'
								name='email'
								id='email'
								placeholder='Email'
								value={newEmail}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Group>
						<Form.Group hidden={!loggedIn}>
							<input
								className='input mt-4'
								type='password'
								name='password'
								id='password'
								value={oldPass}
								onChange={(e) => setOldPass(e.target.value)}
								placeholder='Current password'
							/>
						</Form.Group>
						<Form.Group>
							<input
								className='input mt-4'
								type='password'
								name='password'
								id='password'
								value={newPass}
								onChange={(e) => setNewPass(e.target.value)}
								placeholder={loggedIn ? 'New Password' : 'Password'}
							/>
						</Form.Group>
						{loggedIn || (!loggedIn && !signIn) ? (
							<Form.Group key='password-confirm'>
								<input
									className='input mt-4'
									type='password'
									name='password-confirm'
									id='password-confirm'
									value={confirm}
									onChange={(e) => setConfirm(e.target.value)}
									placeholder='Confirm password'
								/>
							</Form.Group>
						) : null}
						<Form.Group hidden={loggedIn} className='mt-2 ml-3'>
							<Form.Label>
								<Form.Check
									className='checkmark'
									type='checkbox'
									onChange={() => {
										setStaySignedIn(!staySignedIn)
									}}
									checked={staySignedIn}
								/>{' '}
								Stay signed in
							</Form.Label>
						</Form.Group>
						<Form.Group className='toggle-btns mt-2'>
							<Button
								hidden={loggedIn && !changePass}
								variant='outline-primary'
								type='submit'
								className='text-uppercase center-item'
								style={{
									padding: '3px',
									fontSize: '18px',
									width: '45%',
									marginRight: '0.2rem',
								}}>
								{changePass
									? 'Change Password'
									: signIn
									? 'Sign in'
									: 'Register'}
							</Button>
							<Button
								hidden={loggedIn}
								onClick={(e) => {
									const btn = e.target as HTMLElement
									btn.blur()
									toggleAuth()
								}}
								variant='outline-secondary'
								className='text-uppercase center-item'
								style={{
									padding: '3px',
									fontSize: '18px',
									width: '45%',
									marginLeft: '0.2rem',
								}}>
								{signIn ? 'Register' : 'Sign in'}
							</Button>
						</Form.Group>
					</Form>
				)

		const authModal = (
			<Modal
				keyboard={false}
				backdrop={true}
				show={show}
				onEntered={() => {
					addEventListener('click', onClick)
				}}>
				<CloseButton className='close-modal' onClick={closeButton} />
				<Modal.Header className='account-title'>
					<Modal.Title className='text-large'>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{changePass ? loginForm : loggedIn ? null : loginForm}
					<div className='flex'>
						<div className='center-item'>
							{loggedIn ? (
								changePass ? (
									<Button
										variant='outline-secondary'
										onClick={(e) => {
											;(e.target as HTMLElement).blur()
											setChangePass(false)
										}}
										className={'ml-3'}>
										Cancel
									</Button>
								) : (
									<>
										<Button
											color='primary'
											variant='outline-primary'
											onClick={(e) => {
												;(e.target as HTMLElement).blur()
												setChangePass(true)
											}}>
											Change Password
										</Button>
										<Button
											variant='outline-danger'
											onClick={(e) => {
												;(e.target as HTMLElement).blur()
												signOut()
											}}>
											Sign Out
										</Button>
									</>
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