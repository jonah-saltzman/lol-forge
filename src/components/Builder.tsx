import React, {useState, useEffect, useContext} from "react";
import { champContext, itemContext, authContext } from "../App";
import { matchSorter } from "match-sorter";
import Spinner from "./Spinner";
import Select from "react-select";
import { Champ } from '../classes/champ'
import { Build } from '../classes/build'
import OneBuild from "./OneBuild";
import { toast } from "react-toastify";

interface ChampItem {
    value: number
    label: string
}

interface BuildProps {
    build?: Build
    newChamp: (id: number) => void
}

const Builder = (props: BuildProps) => {
	const champs = useContext(champContext)
	const items = useContext(itemContext)
    const auth = useContext(authContext)
	const [loading, setLoading] = useState(true)
	const [champList, setChampList] = useState<Champ[]>(null)
    const [builds, setBuilds] = useState<Build[]>(null)
    const [champ, setChamp] = useState<ChampItem>(null)

    useEffect(() => {
        setChamp(null)
    }, [auth.auth.loggedIn])

    const champMapper = (champs: Champ[]): ChampItem[] => {
        if (!champs.length) return []
			return champs.map((champ) => ({
				value: champ.champId,
				label: champ.champName
			}))
		}
    
    const selectChamp = (val: ChampItem) => {
        setChamp(val)
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
        setChamp({ value: newChamp.champId, label: newChamp.champName })
    }, [props?.build?.champ])

    useEffect(() => {
        if (!auth.auth.loggedIn) {
            setBuilds(null)
            setChamp(null)
        }
    }, [auth.auth.loggedIn])

    const ChampSelector = (item: ChampItem) => {
        const champ = champs.champs.find(champ => champ.champId === item.value)
			return (
				<div className='champ-li'>
					<img src={champ.icon} className='small-icon' />
					<span className='small-name'>{champ.champName}</span>
				</div>
			)
		}

	useEffect(() => {
		if (!champs.champs.length || !items.items.length || !loading) {
			return
		} else {
			setLoading(false)
			setChampList(champs.champs)
		}
	}, [champs.champs, items.items])

    const champOptions = loading ? null : champMapper(champList)

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
						formatOptionLabel={ChampSelector}
						options={champOptions}
						onInputChange={(val) => {
							const newArr = matchSorter(champs.champs, val, {
								keys: ['champName'],
							})
							setChampList(newArr)
						}}
					/>
				</div>
			)}
			<OneBuild build={props.build} />
		</>
	)
}

export default Builder