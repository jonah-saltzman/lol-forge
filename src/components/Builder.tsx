import React, {useState, useEffect, useContext} from "react";
import * as context from '../hooks/context/createContext';
import Spinner from "./Spinner";
import Select, {createFilter} from "react-select";
import { Champ } from '../classes/champ'
import { Build } from '../classes/build'
import { Item } from "../classes/item";
import OneBuild from "./OneBuild";
import { toast } from "react-toastify";
import Slot from './Slot'
import useBuild from "../hooks/useBuild";

interface ListItem {
    value: number
    label: string
    isChamp: boolean
}

interface BuildProps {
    newChamp: (id: number) => void
}

const search = createFilter({ ignoreCase: true, matchFrom: 'start' })

interface JsxMap {
    pos: number
    jsx: JSX.Element
    item: Item
}

const nullItem: Item = null

const initialJsx = [0, 1, 2, 3, 4, 5].map(i => ({pos: i, jsx: <Slot i={i} key={i} />, item: nullItem}))

const genJsx = (item: Item, i: number) => <Slot i={i} key={item.itemId + 1} item={item} />

const Builder = (props: BuildProps) => {
	const champs = useContext(context.champContext)
	const items = useContext(context.itemContext)
    const auth = useContext(context.authContext)
    const {selected: selectedBuild, dispatch} = useContext(context.buildContext)
	const [loading, setLoading] = useState(true)
	const [champList, setChampList] = useState<Champ[]>(null)
    const [itemList, setItemList] = useState<Item[]>(null)
    const [champ, setChamp] = useState<ListItem>(null)
    const [item, setItem] = useState<ListItem>(null)
    const [slotJsx, setSlotJsx] = useState<JsxMap[]>(initialJsx)

    useEffect(() => {
        if (!selectedBuild || !selectedBuild.items) return
        console.log('new selected build: ', selectedBuild.buildId)
        if (selectedBuild && selectedBuild.items.length) {
            console.log('updating tray')
            console.log(selectedBuild.items)
            if (slotJsx.every((jsx, i) => jsx.item.itemId === selectedBuild.items[i].itemId)) {
                console.log('all items same')
                return
            } else {
                console.log('new tray')
                const newArray = initialJsx.map((j, i) => {
                    const item = selectedBuild.items[i]
                    if (!j.item) return {pos: i, item: item, jsx: genJsx(item, i)}
                    else return j
                })
                setSlotJsx(newArray)
            }
        }
        props.newChamp(selectedBuild.champ.champId)
    }, [selectedBuild])

    useEffect(() => {
        setChamp(null)
        setItem(null)
    }, [auth.auth.loggedIn])

    const champMapper = (champs: Champ[]): ListItem[] => {
        if (!champs.length) return []
			return champs.map((champ) => ({
				value: champ.champId,
				label: champ.champName,
                isChamp: true
			}))
		}
    
    const itemMapper = (items: Item[]): ListItem[] => {
        if (!items.length) return []
        return items.map((item) => ({
            value: item.itemId,
            label: item.itemName,
            isChamp: false,
        }))
    }
    
    const selectChamp = (val: ListItem) => {
        setChamp(val)
        if (!auth.auth.loggedIn && !selectedBuild) {
             Build.fromChamp(
                champs.champs.find((c) => c.champId === val.value),
                champs,
                items
            ).then((build) => {
                dispatch({type: Actions.Swap, build: build})
            })
        }
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
        if (!champ) return
        if (selectedBuild && champ.value === selectedBuild.champ.champId) return
        props.newChamp(champ.value)
        if (selectedBuild && auth.auth.loggedIn) {
            selectedBuild
                .changeChamp(
                    champs.champs.find((c) => c.champId === champ.value),
                    champs
                )
                .then(() => selectedBuild.save(auth.auth.token))
                .then(bool => {if (!bool) toast('Error selecting champ')})
        }
    }, [champ])

    useEffect(() => {
        if (!selectedBuild || !selectedBuild.champ) return
        const newChamp = selectedBuild.champ
        setChamp({ value: newChamp.champId, label: newChamp.champName, isChamp: true })
    }, [selectedBuild?.champ])

    useEffect(() => {
        if (!auth.auth.loggedIn) {
            setChamp(null)
        }
    }, [auth.auth.loggedIn])

    const ListSelector = (li: ListItem) => {
        const listItem = li.isChamp 
            ? champs.champs.find(c => c.champId === li.value)
            : items.items.find(i => i.itemId === li.value)
        return (
					<div className='champ-li'>
						<img src={listItem.icon} className='small-icon' />
						<span className='small-name'>{li.label}</span>
					</div>
				)
    }
        

	useEffect(() => {
		if (!champs.champs.length || !items.items.length || !loading) {
			return
		} else {
			setLoading(false)
			setChampList(champs.champs)
            setItemList(items.items)
		}
	}, [champs.champs, items.items])

    const champOptions = loading ? null : champMapper(champList)
    const itemOptions = loading ? null : itemMapper(itemList)

    // useEffect(() => {
    //     console.log(props.build)
    // }, [props.build])


	return (
		<>
			<Spinner center={true} show={loading} />
			{loading ? null : (
				<div className='selectors'>
					<Select
						className='champ-select'
						blurInputOnSelect={true}
						value={champ}
						onChange={selectChamp}
						closeMenuOnScroll={false}
						formatOptionLabel={ListSelector}
						options={champOptions}
						filterOption={search}
						placeholder={'Pick a champion'}
					/>
				</div>
			)}
			<div className='tray'>{slotJsx.map(jsx => jsx.jsx)}</div>
			<div className='selectors'>
				<Select
					className='item-select'
					blurInputOnSelect={false}
					value={item}
					onChange={addItem}
					closeMenuOnScroll={false}
					formatOptionLabel={ListSelector}
					options={itemOptions}
					filterOption={search}
					placeholder={'Add an item'}
				/>
			</div>
		</>
	)
}

export default Builder