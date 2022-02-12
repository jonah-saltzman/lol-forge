import { smallConditions as conditions } from "./default"

interface ValidMove {
    to: number
    board: Board
}

interface Score {
    move: ValidMove
    score: number
}

const PLAYER: Player = 'o'
const OPPONENT: Player = 'x'

const MAX = 1000
const MIN = -1000

let alg_moves = 0

const calc_move = (board: Board): Promise<CompMove> => {
	alg_moves = 0
	const scores: Array<Score> = gen_boards(board, PLAYER).map((move) => ({
		move: move,
		score: miniMax(move.board, 0, false),
	}))
	const bestScore: number = scores.reduce(
		(max, score) => Math.max(max, score.score),
		MIN
	)
	const bestMoves: Array<number> = scores.reduce((arr, score) => {
		if (score.score === bestScore) {
			arr.push(score.move.to)
		}
		return arr
	}, [])
	const randMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
	return Promise.resolve({ to: randMove, moves: alg_moves })
}

export const gen_boards = (board: Board, mover: Player): Array<ValidMove> => {
    const initialArray: Array<ValidMove> = []
    return board.reduce((array, pos, i) => {
        if (pos === null) {
            const validBoard = [...board]
            validBoard[i] = mover
            array.push({to: i, board: validBoard})
        }
        return array
    }, initialArray)
}

const miniMax = (board: Board, depth: number, isMax: boolean): number => {
    alg_moves += 1
    const score = evalBoard(board)
    if (score !== 0) {
        return score === 100
            ? score - depth
            : score + depth
    }
    if (isDraw(board)) {
        return 0
    }
    return isMax
        ? Math.max(MIN, ...gen_boards(board, PLAYER).map(board => miniMax(board.board, depth + 1, false)))
        : Math.min(MAX, ...gen_boards(board, OPPONENT).map(board => miniMax(board.board, depth + 1, true)))
}

const evalBoard = (board: Board): number => {
    if (conditions.some(condition => condition.every(pos => board[pos] === PLAYER))) {
        return 100
    } else if (conditions.some(condition => condition.every(pos => board[pos] === OPPONENT))) {
        return -100
    }
    return 0
}

const isDraw = (board: Board): boolean => {
    return board.every(position => position !== null)
}

export default calc_move