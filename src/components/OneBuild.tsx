import React, {useContext, useEffect, useState} from "react";
import { authContext } from "../App";
import { Build } from "../classes/build";
import Tray from "./Tray";
import Slot from "./Slot";

const slots = [0, 1, 2, 3, 4, 5]

interface OneProps {
    build?: Build
}

const OneBuild = (props: OneProps) => {
    const {auth: {token}} = useContext(authContext)
    const [tray, setTray] = useState(props.build?.items ?? [])

    useEffect(() => {
        if (!props.build) return
        setTray(props.build.items)
    }, [props.build])

    return (
        <Tray>
            {slots.map(i => {
                return tray[i] ? <Slot key={i} item={tray[i]} i={i} /> : <Slot key={i} i={i} />
            })}
        </Tray>
    )
}

export default OneBuild