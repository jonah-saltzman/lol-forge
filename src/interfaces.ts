
interface Auth {
	loggedIn: boolean
	email: string | null
	token: string | null
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
