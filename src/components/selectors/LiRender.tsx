import React, { useContext } from 'react'
import { context } from '../../hooks'

export const LiRender = (li: ListItem) => {
    const c = useContext(context.champContext)
    const i = useContext(context.itemContext)

	const listItem = li.isChamp
		? c.champs.find((c) => c.champId === li.value)
		: i.items.find((i) => i.itemId === li.value)
	return (
		<div className='champ-li'>
			<img src={listItem.icon} className='small-icon' />
			<span className='small-name'>{li.label}</span>
		</div>
	)
}