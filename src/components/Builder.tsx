import React, {useState, useEffect, useContext} from "react";
import { champContext, itemContext, authContext } from "../App";
import { matchSorter } from "match-sorter";
import Spinner from "./Spinner";
import Select from "react-select";
import { Champ } from '../classes/champ'
import { Build } from '../classes/build'

interface ChampItem {
    value: number
    label: string
    name: string
}

interface BuildProps {
    build?: Build
}

const Builder = (props: BuildProps) => {
	const champs = useContext(champContext)
	const items = useContext(itemContext)
	const [loading, setLoading] = useState(true)
	const [champList, setChampList] = useState<Champ[]>(null)
    const [builds, setBuilds] = useState<Build[]>(null)

    const champMapper = (champs: Champ[]): ChampItem[] => {
        if (!champs.length) return []
			return champs.map((champ) => ({
				value: champ.champId,
				label: champ.champName,
				name: champ.champName,
			}))
		}

    const ChampSelector = (item: ChampItem) => {
        const champ = champs.champs.find(champ => champ.champId === item.value)
			return (
				<div className='champ-select'>
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
				<Select
					blurInputOnSelect={false}
					closeMenuOnSelect={false}
					closeMenuOnScroll={false}
                    formatOptionLabel={ChampSelector}
					options={champOptions}
					onInputChange={(val) => {
						const newArr = matchSorter(champs.champs, val, { keys: ['champName'] })
						setChampList(newArr)
					}}
				/>
			)}
		</>
	)
}

export default Builder