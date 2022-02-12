import React from "react"

import { smallConditions, bigConditions } from "./default"
import { gen_boards } from "./3x3minimax"

const awsURL = 'https://09y3qsciu8.execute-api.us-east-1.amazonaws.com/ab'

const defaultBorders = {
    top: true,
    right: true,
    bottom: true,
    left: true
}

const corners = [0, 4, 20, 24]

export const genSpaces = (board: Board, size: BoardSize, click: Function, pvp: boolean, draw: boolean): Array<SpaceProps> => {
    return board.map((player, i) => ({
        key: (size === 'small' ? 's-' : 'l-') + i.toString(10),
        player,
        position: i,
        winPos: false,
        click,
        borders: {...defaultBorders},
        size,
        pvp,
        draw
    }))
}

export const borderClasses = (borders: Borders, size: BoardSize): string => {
    const classes = []
    if (!borders.top) {
        classes.push('top')
    }
    if (!borders.right) {
        classes.push('right')
    }
    if (!borders.bottom) {
        classes.push('bottom')
    }
    if (!borders.left) {
        classes.push('left')
    }
    return classes.join(' ')
}

export const smallMap = (i: number) => {
    const borders = {...defaultBorders}
    if (i % 3 === 0) {
        borders.left = false
    }
    if (i % 3 === 2) {
        borders.right = false
    }
    if (i < 3) {
        borders.top = false
    }
    if (i > 5) {
        borders.bottom = false
    }
    return borders
}

export const bigMap = (i: number) => {
	const borders = { ...defaultBorders }
	if (i % 5 === 0) {
		borders.left = false
	}
	if (i % 5 === 4) {
		borders.right = false
	}
	if (i < 5) {
		borders.top = false
	}
	if (i > 19) {
		borders.bottom = false
	}
	return borders
}

export const toArray = (objects: Array<SpaceProps>, size: BoardSize): Array<Player> => {
    const arr = Array(size === 'small' ? 9 : 25)
    objects.forEach(obj => {
        arr[obj.position] = obj.player
    })
    return arr
}

export const gameOver = (board: Board, size: BoardSize): Results => {
    const conditions = size === 'small' ? smallConditions : bigConditions
    const results: Results = {
        over: false,
        winner: null,
        wins: [],
        started: true
    }
    conditions.forEach(condition => {
        if (
					board[condition[0]] &&
					condition.every((space) => board[space] === board[condition[0]])
				) {
					results.winner = board[condition[0]]
                    results.wins.push(condition)
                    results.over = true
				}
    })
    if (board.every(pos => pos)) {
        results.over = true
    }
    return results
}

export const blankBoard = (size: BoardSize, mode: Mode): Array<SpaceProps> => {
    const board = []
    for (let i = 0; i < (size === 'small' ? 9 : 25); i++) {
        const obj: SpaceProps = {
            winPos: false,
            player: null,
            position: i,
            click: null,
            borders: {...defaultBorders},
            size,
            pvp: mode === 'pvp',
            draw: false
        }
        board.push(obj)
    }
    return board
}

export const aws_alg = async (board: Board): Promise<CompMove> => {
    if (board[12] === null) {
        return {to: 12, moves: 1}
    }
    let quickMoves = 0
    const openCorners: Array<number> = []
    corners.forEach(i => {
        if (board[i] === null) {
            quickMoves += 1
            openCorners.push(i)
        }
    })
    if (openCorners.length > 0) {
        const quickMove = openCorners[Math.floor(Math.random() * openCorners.length)]
        return {to: quickMove, moves: quickMove}
    }
    const body = {board: board}
    const response = await fetch(awsURL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    if (response.status !== 200) {
        const validMoves = gen_boards(board, 'o')
        const randMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        return {to: randMove.to, moves: 1}
    }
    const data = await response.json()
    const move = data.moves[Math.floor(Math.random() * data.moves.length)]
    const checked = data.checked
    return {to: move.to, moves: checked}
}