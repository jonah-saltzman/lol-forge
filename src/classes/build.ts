import { getChampStats, getItemStats } from "../api/info";
import { ChampContext, ItemContext } from "../App";
import { Champ } from "./champ";
import { Item } from "./item";

type ItemInfo = {
    itemid: number,
    from: number[],
    into: number[],
    stats: OneStat[]
}

export interface BuildInfo {
    name?: string
    buildId?: number
    champId: number
    champStats: OneStat[]
    items: ItemInfo[]
}

export class Build {
	name?: string
	champ: Champ
	items: Item[]
	buildId?: number
	saved: boolean
	constructor(info: BuildInfo, champC: ChampContext, itemC: ItemContext, champ?: Champ, items?: Item[]) {
		this.name = info.name
		this.champ = champ ? champ : champC.addChampStats(info.champId, info.champStats)
		this.items = items ? items : info.items.map((item) =>
			itemC.addItemStats(item.itemid, item.stats)
		)
		this.buildId = info.buildId
	}
	public static async create(
		name: string,
		champ: Champ,
		champC: ChampContext,
        itemC: ItemContext,
		items?: Item[]
	): Promise<Build> {
        let addItems: Item[] = items
        let addChamp: Champ = champ
        if (items) {
            const itemStats = await getItemStats(items.map(item => item.itemId))
            if (itemStats) {
                addItems = itemStats.map((stat) =>
                    itemC.addItemStats(stat.itemId, stat.stats)
                )
            }
        }
        const champStats = await getChampStats(champ.champId)
        if (champStats) addChamp = champC.addChampStats(champ.champId, champStats)
        const info: BuildInfo = {
            name,
            champId: addChamp.champId,
            champStats: [],
            items: []
        }
        const newBuild = new Build(info, champC, itemC, addChamp, addItems)
        return newBuild
    }
}