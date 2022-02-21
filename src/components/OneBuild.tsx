import React, {useContext, useEffect, useState} from "react";
import { authContext, buildContext } from "../hooks/context/createContext";
import { Build } from "../classes/build";
import Slot from "./Slot";

const slots = [0, 1, 2, 3, 4, 5]


const OneBuild = () => {
    const {auth: {token}} = useContext(authContext)
    const {selected, dispatch} = useContext(buildContext)

    useEffect(() => {
        console.log('in onebuild')
        console.log(selected)
    }, [selected])

    useEffect(() => {
        if (!selected) return
        console.log('setting tray:')
        console.log(selected.items)
    }, [selected?.items])

    return <div className='tray'></div>
}

export default OneBuild