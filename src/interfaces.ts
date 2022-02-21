
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

interface ChampContext {
	champs: import('./classes/champ').Champ[]
	addChampStats: (
		champ: number,
		stats: OneStat[]
	) => import('./classes/champ').Champ
	champNames: () => string[]
	champIds: () => number[]
}

interface ItemContext {
	items: import('./classes/item').Item[]
	addItemStats: (
		item: number,
		stats: OneStat[]
	) => import('./classes/item').Item
	itemNames: () => string[]
	itemIds: () => number[]
}

interface BuildContext {
	selected: import('./classes/build').Build
	dispatch: (action: BuildAction) => void
}

enum Actions {
    ChangeName = 'CHANGE_NAME',
    ChangeChamp = 'CHANGE_CHAMP',
    PushItem = 'PUSH_ITEM',
    MoveItem = 'MOVE_ITEM',
    PopItem = 'POP_ITEM',
    AddBuildId = 'ADD_BUILD_ID',
    Swap = 'SWAP',
}

type ItemPosition = 0 | 1 | 2 | 3 | 4 | 5

type PopItemById = { itemId: number, position?: never }
type PopItemByPos = { position: ItemPosition, itemId?: never }

type PopItem = PopItemById | PopItemByPos

type BuildAction =
	| { type: Actions.ChangeName; newName: string }
	| { type: Actions.ChangeChamp; newChamp: import('./classes/champ').Champ }
	| { type: Actions.PushItem; item: import('./classes/item').Item }
	| {
			type: Actions.MoveItem
			payload: { itemId: number; newPosition: ItemPosition }
	  }
	| {
			type: Actions.PopItem
			payload: PopItemById | PopItemByPos 
	  }
    | { type: Actions.AddBuildId, buildId: number }
    | { type: Actions.Swap, build: import('./classes/build').Build }

type ItemInfo = {
	itemId: number
	from: number[]
	into: number[]
	stats: OneStat[]
}

interface BuildInfo {
	buildName?: string
	buildId?: number
	champId: number
	champStats: OneStat[]
	items: ItemInfo[]
}

interface BuildPost {
	buildId?: number
	champId: number
	items: number[]
	buildName?: string
}