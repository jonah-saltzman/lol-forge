import React, {useContext, useEffect, useState} from "react";
import { authContext, buildContext } from "../App";
import { Build } from "../classes/build";
import Slot from "./Slot";

const slots = [0, 1, 2, 3, 4, 5]


const OneBuild = () => {
    const {auth: {token}} = useContext(authContext)
    const {selectedBuild, setSelectedBuild} = useContext(buildContext)

    useEffect(() => {
        console.log('in onebuild')
        console.log(selectedBuild)
    }, [selectedBuild])

    useEffect(() => {
        if (!selectedBuild) return
        console.log('setting tray:')
        console.log(selectedBuild.items)
    }, [selectedBuild?.items])

    return <div className='tray'></div>
}

export default OneBuild