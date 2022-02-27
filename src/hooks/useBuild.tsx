
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
                break
            case ItemActions.Left:
                dispatch({
                    type: Actions.MoveItem,
                    payload: {
                        itemId: item.item.itemId,
                        newPosition: toPos(item.i - 1),
                    }
                })
                break
            case ItemActions.Right:
                dispatch({
                    type: Actions.MoveItem,
                    payload: {
                        itemId: item.item.itemId,
                        newPosition: toPos(item.i + 1),
                    }
                })
                break
            default:
                console.error('no action specified')
                break
        }
        dispatch({ type: Actions.Swap, build: selected })
        if (auth.loggedIn) {
            selected.save(auth.token)
        }
    }

    return [patchItems, selected?.items?.length ?? 0]
}

const toPos = (n: number): ItemPosition => {
    return n as ItemPosition
}