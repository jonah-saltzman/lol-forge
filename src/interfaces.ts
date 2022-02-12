

type Player = 'x' | 'o' | null

type BoardSize = 'small' | 'large'

interface Borders {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
}

interface SpaceProps {
    winPos: boolean
    player: Player
    position: number
    click: Function | null
    borders: Borders
    size: BoardSize
    pvp: boolean
    draw: boolean
}

interface OptHandlers {
	reset: Function
	started: boolean
	change: Function
}

interface Options {
    mode: Mode
    size: BoardSize
}

type Board = Array<Player>

interface Results {
    over: boolean
    winner: Player
    wins: Array<Array<number>>
    started: boolean
}

interface Move {
    player: Player
    position: number
}

type Mode = 'pvp' | 'ai'

interface CompMove {
    to: number
    moves: number
}