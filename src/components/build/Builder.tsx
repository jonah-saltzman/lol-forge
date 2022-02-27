import React, {useState, useEffect, useContext} from "react";
import { context } from '../../hooks';
import { ItemSelector, Spinner } from "../../components";
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
        

	useEffect(() => {
		if (!champs.champs.length || !items.items.length || !loading) {
			return
		} else {
			setLoading(false)
			// setChampList(champs.champs)
            setItemList(items.items)
		}
	}, [champs.champs, items.items])

	return (
		<>
			<Spinner center={true} show={loading} />
            <span className="build-title">{selectedBuild ? selectedBuild.buildName ?? null : null}</span>
            <ChampSelector />
            <OneBuild />
			<ItemSelector />
		</>
	)
}