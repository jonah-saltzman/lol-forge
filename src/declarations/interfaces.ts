
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

type Mods = {
    flat?: number,
    percent?: number,
    perLevel?: number
}

type StatType = {
    statId: number
}

type OneStat = StatType & Mods

type StatData = {
    statId: number,
    statName: string,
    alias: string | null
}

interface ChampContext {
	champs: import('../classes/champ').Champ[]
	addChampStats: (
		champ: number,
		stats: OneStat[]
	) => import('../classes/champ').Champ
	champNames: () => string[]
	champIds: () => number[]
    selectedChamp: import('../classes/champ').Champ
    setSelectedChamp: (champ: import('../classes/champ').Champ) => void
}

interface ItemContext {
	items: import('../classes/item').Item[]
	addItemStats: (
		item: number,
		stats: OneStat[]
	) => import('../classes/item').Item
	itemNames: () => string[]
	itemIds: () => number[]
}

interface BuildContext {
	selected: import('../classes/build').Build
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
	| { type: Actions.ChangeChamp; newChamp: import('../classes/champ').Champ }
	| { type: Actions.PushItem; item: import('../classes/item').Item }
	| {
			type: Actions.MoveItem
			payload: { itemId: number; newPosition: ItemPosition }
	  }
	| {
			type: Actions.PopItem
			payload: PopItemById | PopItemByPos 
	  }
    | { type: Actions.AddBuildId, buildId: number }
    | { type: Actions.Swap, build: import('../classes/build').Build }

type ItemInfo = {
	itemId: number
	from: number[]
	into: number[]
	statsArray: OneStat[]
    itemName: string
    icon: string
}

interface ChampInfo {
	champId: number
	champName: string
	title: string
	icon: string
	resourceType: string
}

interface ItemInfoI {
	itemId: number
	itemName: string
	icon: string
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

interface ListProps {
	authed: boolean
	loading: boolean
	newBuild: (name: string) => Promise<void>
	builds: import('../classes/build').Build[]
    setBuilds: (array: import('../classes/build').Build[]) => void
}

interface JsxMap {
	pos: number
	jsx: JSX.Element
	item: import('../classes/item').Item
}

interface ListItem {
	value: number
	label: string
	isChamp: boolean
}

interface ItemResponse {
	info: ItemInfoI
	stats: OneStat[]
}

interface ItemStats {
	itemId: number
	stats: OneStat[]
}

interface NavProps {
	toggle?: () => void
}

interface SpinProps {
	center: boolean
	show: boolean
}

interface SlotProps {
	item?: import('../classes').Item
	i: number
}

enum ItemActions {
	Left = 'MOVE_LEFT',
	Right = 'MOVE_RIGHT',
	Delete = 'DELETE',
}

type patchItems = [(item: SlotProps, action: ItemActions) => void, number]