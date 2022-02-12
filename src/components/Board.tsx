import React, { useEffect, useState } from "react";
import { gameOver, blankBoard, toArray, aws_alg } from "../helpers";
import Options from "./Options";
import smallAlg from '../3x3minimax'
import Space from "./Space";
import { toast } from "react-toastify";
import { Spinner, Modal } from "react-bootstrap";

const defaultStatus: Results = { over: false, winner: null, wins: [[]], started: false }

const Board = () => {
    const [ board, setBoard ] = useState<Array<SpaceProps>>(null)
    const [ size, setSize ] = useState<BoardSize>('small')
    const [ mode, setMode ] = useState<Mode>('pvp')
    const [ player, setPlayer ] = useState<Player>('x')
    const [ gameStatus, setStatus ] = useState<Results>(defaultStatus)
    const [ thinking, setThinking ] = useState<boolean>(false)

    useEffect(() => {
        reset()
    }, [])

    const reset = () => {
        setBoard(blankBoard(size, mode))
        setPlayer('x')
        setStatus(defaultStatus)
        toast.dismiss()
    }

    const changeOptions = (opts: Options) => {
        if (opts.mode !== mode) {
            setMode(opts.mode)
        }
        if (opts.size !== size) {
            setSize(opts.size)
        }
    }

    useEffect(() => {
        reset()
    }, [size, mode])

    const makeMove = (pos: number) => {
        const tempBoard = [...board]
        tempBoard[pos].player = player
        const status = gameOver(toArray(tempBoard, size), size)
        const newBoard: Array<SpaceProps> = []
        tempBoard.forEach(obj => {
            const newObj = {...obj}
            if (newObj.position === pos) {
                newObj.player = player
            }
            if (status.over) {
                if (!status.winner) {
                    newObj.draw = true
                    newBoard.push(newObj)
                    return
                } else {
                    for (const win of status.wins) {
                        if (win.some(ind => ind === newObj.position)) {
                            newObj.winPos = true
                        }
                    }
                }
            }
            newBoard.push(newObj)
        })
        setBoard(newBoard)
        setPlayer(player === 'x' ? 'o' : 'x')
        setStatus(status)
    }

    const click = (pos: number) => {
        if (gameStatus.over || board.find(p => p.position === pos).player || thinking || mode === 'ai' && player === 'o') {
            return
        }
        toast.dismiss()
        makeMove(pos)
    }

    useEffect(() => {
        if (gameStatus.over || player === 'x' || mode === 'pvp') {
            return
        }
        const boardArray = toArray(board, size)
        const alg_function = size === 'small' ? smallAlg : aws_alg
        if (size === 'large') {
            setThinking(true)
        }
        alg_function(boardArray).then((move) => {
            makeMove(move.to)
            toast(`The computer moved to position ${move.to}\nafter analyzing ${move.moves.toLocaleString()} moves.`)
            if (size === 'large') {
                setThinking(false)
            }
        })
    }, [player])

    const thinker = (
			<div className='thinker'>
				<span className='think-text'>Thinking...</span>
				<Spinner animation='grow' className='spin' variant='primary' />
                <img className='aws-logo' src="https://d0.awsstatic.com/logos/powered-by-aws.png" alt="Powered by AWS Cloud Computing"></img>
			</div>
		)

    const modal = (
        <Modal centered dialogClassName="modal-50w" show={thinking} backdrop='static' keyboard={false}>
            {thinker}
        </Modal>
    )

    return (
			<>
				<Options change={changeOptions} reset={reset} started={gameStatus.started} />
				<div className={size}>
					{board ? board.map((space, i) => {
                        space.click = click
                        return <Space {...space} key={'s-' + i} />
                        }
					) : null}
				</div>
                {modal}
			</>
		)
}

export default Board