import React from "react";
import { DomProps, OptionSnapshot, SelectedOption } from "react-select-search";
import { Champ } from "../classes/champ";

interface SelectorProps {
    domProps: DomProps
    option: SelectedOption
    snapshot: OptionSnapshot
    className: string
}

const ChampSelector = (champ: Champ, props: SelectorProps, select: (id: number) => void) => {
    return (
        <div onClick={(e) => {
            select(champ.champId)
            }} className='champ-select'>
            <img src={champ.icon} className='small-icon' />
            <span className="small-name">{champ.champName}</span>
        </div>
    )
}

export default ChampSelector