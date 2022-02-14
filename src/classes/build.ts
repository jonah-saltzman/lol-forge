import { patchBuild, createBuild } from "../api/builds";
import { getChampStats, getItemStats } from "../api/info";
import { ChampContext, ItemContext } from "../App";
import { Champ } from "./champ";
import { Item } from "./item";

export type ItemInfo = {
    itemId: number,
    from: number[],
    into: number[],
    stats: OneStat[]
}

export interface BuildInfo {
    buildName?: string
    buildId?: number
    champId: number
    champStats: OneStat[]
    items: ItemInfo[]
}

export interface BuildPost {
	buildId?: number
	champId: number
	items: number[]
	buildName?: string
}

export class Build {
	buildName?: string
	champ: Champ
	items: Item[]
	buildId?: number
	saved: boolean
	constructor(info: BuildInfo, champC: ChampContext, itemC: ItemContext, champ?: Champ, items?: Item[]) {
		this.buildName = info.buildName
		this.champ = champ ? champ : champC.addChampStats(info.champId, info.champStats)
		this.items = items ? items : info.items.map((item) => {
            return itemC.addItemStats(item.itemId, item.stats)
        })
		this.buildId = info.buildId
	}
	public static async create(
		buildName: string,
		champ: Champ,
		champC: ChampContext,
        itemC: ItemContext,
		items?: Item[]
	): Promise<Build> {
        ('in static create')
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
            buildName,
            champId: addChamp.champId,
            champStats: [],
            items: []
        }
        const newBuild = new Build(info, champC, itemC, addChamp, addItems)
        return newBuild
    }
    async changeChamp(newChamp: Champ, champC: ChampContext): Promise<void> {
        if (newChamp.hasStats) {
            this.champ = newChamp
            return
        } else {
            const stats = await getChampStats(newChamp.champId)
            this.champ = champC.addChampStats(newChamp.champId, stats)
            return
        }
    }
    async save(token: string): Promise<boolean> {
        if (this.buildId) {
            return this.verifyResponse(await patchBuild(token, this))
        } else {
            return this.verifyResponse(await createBuild(token, this))
        }
    }
    toObject(): BuildPost {
        return {
            buildId: this.buildId,
            champId: this.champ.champId,
            items: this.items.map(item => item.itemId),
            buildName: this.buildName
        }
    }
    verifyResponse(res: BuildInfo): boolean {
        if (this.buildId && this.buildId !== res.buildId) return false
        if (this.buildName && this.buildName !== res.buildName) return false
        if (this.champ.champId !== res.champId) return false
        if (!this.items.every(item => res.items.some(info => info.itemId === item.itemId))) return false
        if (this.items.length !== res.items.length) return false
        return true
    }
}