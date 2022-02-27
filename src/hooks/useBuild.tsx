
import React, {useContext} from "react";
import { context } from "../hooks";
import { Build } from "../classes/build";
import { ItemActions, Actions } from '../declarations'

export const useBuild = (): patchItems => {
    const {selected, dispatch} = useContext(context.buildContext)
    const {auth} = useContext(context.authContext)

    const patchItems = (item: SlotProps, action: ItemActions) => {
        console.log(item, action)
        switch (action) {
            case ItemActions.Delete:
                console.log('deleting item: ', toPos(item.i))
                dispatch({
                    type: Actions.PopItem,
                    payload: { position: toPos(item.i) },
                })
                if (auth.loggedIn) {
                    selected.save(auth.token).then((r) => {
                        dispatch({ type: Actions.Swap, build: r })
                    })
                }
                break
            default:
                console.log('no action specified')
                break
        }
    }

    return patchItems
}

const toPos = (n: number): ItemPosition => {
    return n as ItemPosition
}