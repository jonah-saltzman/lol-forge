import React, {useState, useEffect, useContext} from "react";
import { champContext } from "../App";
import Spinner from "./Spinner";
import SelectSearch, { DomProps, OptionSnapshot, SelectedOption, SelectedOptionValue, SelectSearchProps } from "react-select-search";
import ChampSelector from "./ChampSelector";
import { champSearch } from "../helpers";

const Main = () => {
    const champs = useContext(champContext)
    const [loading, setLoading] = useState(true)
    const [fuse, setFuse] = useState(null)
    const [champInput, setChampInput] = useState('')

    const onChampChange = (val: SelectedOptionValue) => {
        const id = toNum(val)
        setChampInput(champs.champs[id].champName)
    }

    const selectChamp = (id: number) => {
        setChampInput(champs.champs[id].champName)
    }

    useEffect(() => {
        if (!champs || Object.keys(champs).length === 0) {
            return
        } else {
            setLoading(false)
            console.log(champs.champNames())
        }
    }, [champs])

    useEffect(() => {
        console.log(champInput)
    }, [champInput])

    const champOptions = champs
			.champIds()
			.map((id) => ({ name: champs.champs[id].champName, value: id }))

    const search = champSearch(champOptions)

    const champSelector = (
			domProps: DomProps,
			option: SelectedOption,
			snapshot: OptionSnapshot,
			className: string
		): React.ReactNode => {
            const champ = champs.champs[parseInt(option.value)]
            const props = {domProps, option, snapshot, className}
            return (
               ChampSelector(champ, props, selectChamp)
            )
        }

    return (
			<>
				<Spinner center={true} show={loading} />
				<SelectSearch
					filterOptions={champSearch}
					options={champOptions}
					search
					placeholder='Enter champion name'
					id='champSearch'
					className={'champselect'}
					multiple={false}
					value={champInput}
					onChange={onChampChange}
                    renderOption={champSelector}
				/>
			</>
		)
}

const toNum = (e: SelectedOptionValue) => {
    const u = e as unknown
    const num = u as number
    return num
}

export default Main