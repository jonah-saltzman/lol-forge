
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

// enum ChampModifiers {
// 	FLAT = 'flat',
// 	PERCENT = 'percent',
// 	perLevel = 'perLevel',
// 	PPL = 'percentPerLevel',
// }

type Mods = {
    flat?: number,
    percent?: number,
    perLevel?: number
}

type StatType = {
    statId: number
}

type OneStat = StatType & Mods

// interface BaseStat {
//     statId: number
// 	flat: number
// 	percent: number
//     perLevel: number
//     percentPerLevel: number
//     percentBase?: number
//     percentBonus?: number
// }

// interface ChampStat extends BaseStat {
// }

// interface ItemStat extends BaseStat {
//     percentBase: number
//     percentBonus: number
//     unique: boolean
//     named: string
//     passive: boolean
// }

// type Stat = ChampStat | ItemStat

type StatData = {
    statId: number,
    statName: string,
    alias: string | null
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
