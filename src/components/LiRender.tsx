import React, {useContext} from 'react'
import { champContext, itemContext } from '../hooks/context/createContext'

const LiRender = (li: ListItem) => {
    const c = useContext(champContext)
    const i = useContext(itemContext)

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

export default LiRender