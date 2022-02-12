import React, { useEffect, useState } from "react";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const Options = (props: OptHandlers) => {
    const { reset, started, change } = props
    const [ mode, setMode ] = useState<Mode>('pvp')
    const [ size, setSize ] = useState<BoardSize>('small')

    const changeMode = (value: Mode) => {
        setMode(value)
    }

    const changeSize = (value: BoardSize) => {
        setSize(value)
    }

    useEffect(() => {
        change({mode, size})
    }, [mode, size])

    return (
			<>
				<div className='options'>
					<Button
						disabled={!started}
						onClick={() => reset()}
						className='button reset grp'>
						Reset
					</Button>
					<ToggleButtonGroup
                        className='grp'
						onChange={changeMode}
						type='radio'
						name='mode-options'
						defaultValue={'pvp'}>
						<ToggleButton
							variant={mode === 'ai' ? 'outline-primary' : 'primary'}
							id='tbg-radio-1'
							value={'pvp'}>
							PVP
						</ToggleButton>
						<ToggleButton
							variant={mode === 'pvp' ? 'outline-danger' : 'danger'}
							id='tbg-radio-2'
							value={'ai'}>
							vs AI
						</ToggleButton>
					</ToggleButtonGroup>
					<ToggleButtonGroup
                        className='grp'
						onChange={changeSize}
						type='radio'
						name='size-options'
						defaultValue={'small'}>
						<ToggleButton
							variant={size === 'large' ? 'outline-primary' : 'primary'}
							id='tbg-radio-3'
							value={'small'}>
							3x3
						</ToggleButton>
						<ToggleButton
							variant={size === 'small' ? 'outline-success' : 'success'}
							id='tbg-radio-4'
							value={'large'}>
							5x5
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
			</>
		)
}

export default Options