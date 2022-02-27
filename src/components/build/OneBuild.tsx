import React, {useContext, useEffect, useState} from "react";
import { context } from "../../hooks";
import { Build, Item } from "../../classes";
import { Slot, Tray } from "..";

const nullItem: Item = null
const slots = [0, 1, 2, 3, 4, 5]

export const OneBuild = () => {
    const {auth: {token}} = useContext(context.authContext)
    const {selected, dispatch} = useContext(context.buildContext)
    const [tray, setTray] = useState<JSX.Element[]>(null)

    useEffect(() => {
        // console.log('selected build:')
        // console.log(selected)
        if (!selected) {
            setTray(slots.map((i) => <Slot i={i} key={i} />))
        } else {
            setTray(
							slots.map((i) => (
								<Slot item={selected?.items[i] ?? null} key={i} i={i} />
							))
						)
        }        
    }, [selected])

    return (
			<Tray>
				{tray}
			</Tray>
		)
}