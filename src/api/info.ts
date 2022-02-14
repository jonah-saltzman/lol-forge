import { Champ, ChampInfo } from "../classes/champ";
import { Item, ItemInfo } from "../classes/item";
import call from "./caller";

export const getChamps = async (): Promise<Champ[]> => {
    const res = await call('/champs', 'GET')
    const champInfo = await res.json() as ChampInfo[]
    return champInfo.map(info => new Champ(info))
}

export const getItems = async(): Promise<Item[]> => {
    const res = await call('/items', 'GET')
    const itemInfo = await res.json() as ItemInfo[]
    return itemInfo.map(info => new Item(info))
}

interface ItemResponse {
    info: ItemInfo
    stats: OneStat[]
}

interface ItemStats {
    itemId: number
    stats: OneStat[]
}

export const getItemStats = async (ids: number[]): Promise<ItemStats[]> => {
    const req = {items: ids}
    const res = await call('/items', 'POST', req)
    return res.status === 200
			? ((await res.json()) as ItemResponse[]).map((res) => ({
					itemId: res.info.itemId,
					stats: res.stats,
			  }))
			: null
}

export const getChampStats = async (id: number): Promise<OneStat[]> => {
    const res = await call('/champs/' + id.toString(), 'GET')
    return res.status === 200
        ? await res.json() as OneStat[]
        : null
}