import { createContext } from "react"

export const authContext = createContext<AuthContext | null>(null)
export const champContext = createContext<ChampContext | null>(null)
export const itemContext = createContext<ItemContext | null>(null)
export const buildContext = createContext<BuildContext | null>({selected: null, dispatch: null})