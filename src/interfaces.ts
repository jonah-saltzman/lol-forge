
interface Auth {
	loggedIn: boolean
	email: string | null
	token: string | null
}

interface Login {
    email: string
    password: string
}

interface ChangePass {
    oldPass: string
    newPass: string
    token: string
}

interface SignupResponse {
	email: string
}

interface TokenResponse {
	token: string
}

interface ApiResponse {
	status: number
	message?: string
	data?: SignupResponse | TokenResponse
	redirect?: string
}

type AuthType = 'signin' | 'signup' | 'change'

interface LoginResponse extends Auth {
    message?: string
}

interface AuthContext {
    setAuth: (authState: Auth) => void
    auth: Auth
}

// TODOs

// Stats
// class
// interface


// Item
// props interface

// Champ
// props interface

// Build
// props interface

// BuildList
// Props interface

// Centerdisplay
// Props interface
//      - toggle 1 vs compare
