import React, {useEffect, useState, useContext} from "react";
import { Champ, Build } from "../classes";
import { champContext, buildContext, authContext, itemContext } from "../hooks/context/createContext";
import Select, { createFilter } from 'react-select'
import LiRender from "./LiRender";

const search = createFilter({ ignoreCase: true, matchFrom: 'start' })

const ChampSelector = () => {
    const [champ, setChamp] = useState<ListItem>(null)
    const b = useContext(buildContext)
    const c = useContext(champContext)
    const a = useContext(authContext)
    const i = useContext(itemContext)

    // const selectChamp = (id: number) => {
    //     const newChamp = c.champs.find(champ => champ.champId === id)
    //     c.setSelectedChamp(newChamp)
    //     if (b.selected) {
    //         if (b.selected.champ.champId === newChamp.champId) return
    //         b.dispatch({type: Actions.ChangeChamp, newChamp })
    //     }
    // }

    const selectChamp = (val: ListItem) => {
			setChamp(val)
            const selectedChamp = c.champs.find((c) => c.champId === val.value)
			if (!a.auth.loggedIn && !b.selected) {
				Build.fromChamp(
					selectedChamp,
					c,
					i
				).then((build) => {
					b.dispatch({ type: Actions.Swap, build: build })
				})
			} else if (a.auth.loggedIn && b.selected && b.selected.champ.champId !== val.value) {
                b.dispatch({type: Actions.ChangeChamp, newChamp: selectedChamp})
            }
		}
    
    useEffect(() => {
        setChamp({
					value: b.selected.champ.champId,
					label: b.selected.champ.champName,
					isChamp: true,
				})
    }, [b?.selected?.champ])

    return (
			<div className='selectors'>
				<Select
					className='champ-select'
					blurInputOnSelect={true}
					value={champ}
					onChange={selectChamp}
					closeMenuOnScroll={false}
					formatOptionLabel={LiRender}
					options={
						c?.champs?.length
							? c.champs.map((champ) => ({
									value: champ.champId,
									label: champ.champName,
									isChamp: true,
							  }))
							: null
					}
					filterOption={search}
					placeholder={'Pick a champion'}
				/>
			</div>
		)
}

export default ChampSelector