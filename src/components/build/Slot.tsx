import React from "react";
import { useBuild } from "../../hooks";
import { ItemActions } from "../../declarations";
import { BiArrowBack, BiX } from 'react-icons/bi'

export const Slot = (props: SlotProps) => {
    const [patcher, len] = useBuild()
    // console.log(`slot ${props.i}: `)
    // console.log(props.item)
    return (
			<div className='slot'>
				{props.item ? (
					<>
						<div className='top'>
							<BiX className='delete-item' color='red' onClick={() => patcher(props, ItemActions.Delete)} />
							<img className='large-icon' src={props.item.icon} />
						</div>
						<div className='arrows'>
							{props.i === 0 ? null : <BiArrowBack onClick={() => patcher(props, ItemActions.Left)} />}
							{props.i === len - 1 ? null : <BiArrowBack onClick={() => patcher(props, ItemActions.Right)} className='right' />}
						</div>
					</>
				) : null}
			</div>
		)
}