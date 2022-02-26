import React, {useContext, useEffect, useState} from "react";
import { context } from "../../hooks";
import { Build, Item } from "../../classes";
import { Slot, Tray } from "..";

const nullItem: Item = null
const slots = [0, 1, 2, 3, 4, 5]

export const OneBuild = () => {
    const {auth: {token}} = useContext(context.authContext)
    const {selected, dispatch} = useContext(context.buildContext)

    // useEffect(() => {
    //     console.log('in onebuild')
    //     console.log(selected)
    // }, [selected])

    // useEffect(() => {
    //     if (!selected) return
    //     console.log('setting tray:')
    //     console.log(selected.items)
    // }, [selected?.items])


    return (
			<Tray>
				{selected
					? slots.map((i) => <Slot item={selected?.items[i] ?? null} key={i} i={i} />)
					: slots.map((i) => <Slot i={i} key={i} />)}
			</Tray>
		)
}