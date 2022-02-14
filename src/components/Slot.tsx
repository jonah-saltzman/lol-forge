import React from "react";
import { Item } from "../classes/item";
import { BiArrowBack } from 'react-icons/bi'
import { icon } from '../helpers'

interface SlotProps {
    item?: Item
    i: number
}

const Slot = (props: SlotProps) => {
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

export default Slot