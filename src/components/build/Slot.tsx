import React from "react";
import { Item } from "../../classes";
import { BiArrowBack } from 'react-icons/bi'

interface SlotProps {
    item?: Item
    i: number
} 

export const Slot = (props: SlotProps) => {
    // console.log(`slot ${props.i}: `)
    // console.log(props.item)
    return (
			<div className='slot'>
				{props.item ? (
					<>
						<img className='large-icon' src={props.item.icon} />
						<div className='arrows'>
							{props.i === 0 ? null : <BiArrowBack />}
							{props.i === 5 ? null : <BiArrowBack className='right' />}
						</div>
					</>
				) : null}
			</div>
		)
}