import React from 'react'
import { borderClasses, smallMap, bigMap } from '../helpers'

const Space = (props: SpaceProps) => {
    const { click, position, size, player, pvp, draw, winPos } = props
    const mapper = size === 'small' ? smallMap : bigMap
    const borders = mapper(position)
    let classes = borderClasses(borders, size) + ' space'
    if (draw) {
        classes += ' draw'
    } else if (winPos) {
        if (pvp || (player === 'x')) {
            classes += ' green'
        } else {
            classes += ' red'
        }
    }
	return (
        <div onClick={() => click(position)} className={classes}>{player}</div>
    )
}

export default Space
