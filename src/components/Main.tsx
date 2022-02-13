import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { champContext } from "../App";
import Spinner from "./Spinner";

const Main = () => {
    const champs = useContext(champContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!champs || champs.length === 0) {
            return
        } else {
            setLoading(false)
            console.log(champs)
        }
    }, [champs])

    return (
        <Spinner center={true} show={loading} />
    )
}

export default Main