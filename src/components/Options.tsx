import React, { useEffect, useState } from "react";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const Options = () => {

    return (
			<>
				<div className='options'>
					<Button
						disabled={false}
						onClick={() => {}}
						className='button reset grp'>
						Reset
					</Button>
					<ToggleButtonGroup
						className='grp'
						onChange={() => {}}
						type='radio'
						name='mode-options'
						defaultValue={'pvp'}>
						<ToggleButton
							variant={'outline-primary'}
							id='tbg-radio-1'
							value={'pvp'}>
							PVP
						</ToggleButton>
						<ToggleButton
							variant={'outline-danger'}
							id='tbg-radio-2'
							value={'ai'}>
							vs AI
						</ToggleButton>
					</ToggleButtonGroup>
					<ToggleButtonGroup
						className='grp'
						onChange={() => {}}
						type='radio'
						name='size-options'
						defaultValue={'small'}>
						<ToggleButton
							variant={'outline-primary'}
							id='tbg-radio-3'
							value={'small'}>
							3x3
						</ToggleButton>
						<ToggleButton
							variant={'outline-success'}
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