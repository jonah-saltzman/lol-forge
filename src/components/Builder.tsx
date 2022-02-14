import React, {useState, useEffect, useContext} from "react";
import { champContext, itemContext, authContext, buildContext } from "../App";
import Spinner from "./Spinner";
import Select, {createFilter} from "react-select";
import { Champ } from '../classes/champ'
import { Build } from '../classes/build'
import { Item } from "../classes/item";
import OneBuild from "./OneBuild";
import { toast } from "react-toastify";

interface ListItem {
    value: number
    label: string
    isChamp: boolean
}

interface BuildProps {
    build?: Build
    newChamp: (id: number) => void
    guestBuild: (build: Build) => void
    updateBuild: (build: Build) => void
}

const search = createFilter({ ignoreCase: true, matchFrom: 'start' })

const Builder = (props: BuildProps) => {
	const champs = useContext(champContext)
	const items = useContext(itemContext)
    const auth = useContext(authContext)
    const {build: selectedBuild} = useContext(buildContext)
	const [loading, setLoading] = useState(true)
	const [champList, setChampList] = useState<Champ[]>(null)
    const [itemList, setItemList] = useState<Item[]>(null)
    const [champ, setChamp] = useState<ListItem>(null)
    const [item, setItem] = useState<ListItem>(null)

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
        if (!auth.auth.loggedIn && !props.build) {
             Build.fromChamp(
                champs.champs.find((c) => c.champId === val.value),
                champs,
                items
            ).then(props.guestBuild)
        }
    }

    const addItem = (val: ListItem) => {
        setItem(null)
        if (!props.build) return toast('Select a champion to begin')
        if (props.build.items.length >= 6) return
        props.build.items.push(items.items.find(i => i.itemId === val.value))
        if (auth.auth.loggedIn) props.build.save(auth.auth.token)
        //console.log(props.build)
        props.updateBuild(props.build)
    }

    useEffect(() => {
        if (!champ) return
        props.newChamp(champ.value)
        if (props.build && auth.auth.loggedIn) {
            props.build.changeChamp(champs.champs.find(c => c.champId === champ.value), champs)
            if (!props.build.save(auth.auth.token)) {
                toast('Error selecting champ')
            }
        }
    }, [champ])

    useEffect(() => {
        if (!props.build) return
        const { build: { champ: newChamp } } = props
        setChamp({ value: newChamp.champId, label: newChamp.champName, isChamp: true })
    }, [props?.build?.champ])

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
			<OneBuild build={props.build} />
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