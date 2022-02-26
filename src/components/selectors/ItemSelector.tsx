import React, { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Champ, Build } from '../../classes'
import { context as ctx } from '../../hooks'
import Select, { createFilter } from 'react-select'
import { LiRender } from '..'
import { Actions } from '../../declarations'

const search = createFilter({ ignoreCase: true, matchFrom: 'start' })

export const ItemSelector = () => {
	const [item, setItem] = useState<ListItem>(null)
	const b = useContext(ctx.buildContext)
	const c = useContext(ctx.champContext)
	const a = useContext(ctx.authContext)
	const i = useContext(ctx.itemContext)

	const addItem = async (val: ListItem) => {
		setItem(null)
		if (!b.selected) {
            toast('Create or select a build to add items')
            return
        }
		if (b.selected.items.length >= 6) {
            toast('Up to 6 items per build')
            return
        }
		b.dispatch({
			type: Actions.PushItem,
			item: i.items.find((i) => i.itemId === val.value)
		})
        if (a.auth.loggedIn) {
            b.selected.save(a.auth.token)
        }
		// if (auth.auth.loggedIn) await selectedBuild.save(auth.auth.token)
	}

	return (
		<div className='selectors'>
			<Select
				className='champ-select'
				blurInputOnSelect={true}
				value={item}
				onChange={addItem}
				closeMenuOnScroll={false}
				formatOptionLabel={(data: ListItem) => <LiRender {...data} />}
				options={
					i?.items?.length
						? i.items.map((item) => ({
								value: item.itemId,
								label: item.itemName,
								isChamp: false,
						  }))
						: null
				}
				filterOption={search}
				placeholder={'Add an item'}
			/>
		</div>
	)
}
