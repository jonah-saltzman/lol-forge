import React, {useState, useEffect, useContext} from "react";
import { context } from '../../hooks';
import { Spinner } from "../../components";
import { Champ, Build, Item } from '../../classes'
import { OneBuild, Slot, LiRender, ChampSelector } from "..";
import { toast } from "react-toastify";
import { Actions } from '../../declarations'

const genJsx = (item: Item, i: number) => <Slot i={i} key={item.itemId + 1} item={item} />

export const Builder = () => {
	const champs = useContext(context.champContext)
	const items = useContext(context.itemContext)
    const auth = useContext(context.authContext)
    const {selected: selectedBuild, dispatch} = useContext(context.buildContext)
	const [loading, setLoading] = useState(true)
    const [itemList, setItemList] = useState<Item[]>(null)
    const [item, setItem] = useState<ListItem>(null)
    
    const itemMapper = (items: Item[]): ListItem[] => {
        if (!items.length) return []
        return items.map((item) => ({
            value: item.itemId,
            label: item.itemName,
            isChamp: false,
        }))
    }

    const addItem = async (val: ListItem) => {
        setItem(null)
        if (!selectedBuild) return toast('Select a champion to begin')
        if (selectedBuild.items.length >= 6) return
        dispatch({
					type: Actions.PushItem,
					item: items.items.find((i) => i.itemId === val.value),
				})
        // if (auth.auth.loggedIn) await selectedBuild.save(auth.auth.token)
    }
        

	useEffect(() => {
		if (!champs.champs.length || !items.items.length || !loading) {
			return
		} else {
			setLoading(false)
			// setChampList(champs.champs)
            setItemList(items.items)
		}
	}, [champs.champs, items.items])

    const itemOptions = loading ? null : itemMapper(itemList)

	return (
		<>
			<Spinner center={true} show={loading} />
            <ChampSelector />
            <OneBuild />
			<div className='selectors'>
				{/* <Select
					className='item-select'
					blurInputOnSelect={false}
					value={item}
					onChange={addItem}
					closeMenuOnScroll={false}
					formatOptionLabel={LiRender}
					options={itemOptions}
					filterOption={search}
					placeholder={'Add an item'}
				/> */}
			</div>
		</>
	)
}