import { patchBuild, createBuild, deleteBuild } from "../api/builds";
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
    previousInfo: BuildInfo
	constructor(
		info: BuildInfo,
		champC: ChampContext,
		itemC: ItemContext,
		champ?: Champ,
		items?: Item[]
	) {
		this.buildName = info.buildName
		this.champ = champ
			? champ
			: champC.addChampStats(info.champId, info.champStats)
		this.items = items
			? items
			: info.items.map((item) => {
					return itemC.addItemStats(item.itemId, item.stats)
			  }) && ([] as Item[])
		this.buildId = info.buildId
        this.previousInfo = this.getBuildInfo()
	}
	public static async create(
		buildName: string,
		champ: Champ,
		champC: ChampContext,
		itemC: ItemContext,
		items?: Item[]
	): Promise<Build> {
		let addItems: Item[] = items
		let addChamp: Champ = champ
		if (items) {
			const itemStats = await getItemStats(items.map((item) => item.itemId))
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
			items: [],
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
            const need = this.needSave()
            console.log('needtosave: ', need)
            console.log('saving build with id')
            if (!this.needSave()) return true
            const patchResult = await patchBuild(token, this)
            console.log(patchResult)
            const verify = (this.verifyResponse(patchResult))
            console.log('verify: ', verify)
			return this.verifyResponse(patchResult)
		} else {
            console.log('saving new build')
			const newBuildInfo = await createBuild(token, this)
            console.log(newBuildInfo)
			if (newBuildInfo) {
				this.buildId = newBuildInfo.buildId
				return true
			} else {
				return false
			}
		}
	}
	async delete(token: string): Promise<boolean> {
		return await deleteBuild(token, this)
	}
	toObject(): BuildPost {
		return {
			buildId: this.buildId,
			champId: this.champ.champId,
			items: this.items.map((item) => item.itemId),
			buildName: this.buildName,
		}
	}
	verifyResponse(res: BuildInfo): boolean {
        return this.needSave(res)
	}
	public static async fromChamp(
		champ: Champ,
		champC: ChampContext,
		itemC: ItemContext
	): Promise<Build> {
		const items: ItemInfo[] = []
		const info: BuildInfo = {
			champId: champ.champId,
			champStats: champ.hasStats
				? champ.statsArr
				: await getChampStats(champ.champId),
			items,
		}
		return new Build(info, champC, itemC, champ)
	}
    getBuildInfo(): BuildInfo {
        const itemInfos: ItemInfo[] = this.items.map((item) => ({
            itemId: item.itemId,
            from: item.from.map((from) => from.itemId),
            into: item.into.map((into) => into.itemId),
            stats: item.stats,
        }))
        return {
            buildName: this.buildName,
            buildId: this.buildId,
            champId: this.champ.champId,
            champStats: this.champ.statsArr,
            items: itemInfos
        }
    }
    needSave(info?: BuildInfo): boolean {
        const current = info ? info : this.getBuildInfo()
        return (this.previousInfo.buildName !== current.buildName)
            || (this.previousInfo.champId !== current.champId)
            || (this.previousInfo.items.length !== current.items.length)
            || (current.items.some((currentItem, i) => currentItem.itemId !== this.previousInfo.items[i].itemId))
    }
}

// export type ItemInfo = {
// 	itemId: number
// 	from: number[]
// 	into: number[]
// 	stats: OneStat[]
// }

// export interface BuildInfo {
// 	buildName?: string
// 	buildId?: number
// 	champId: number
// 	champStats: OneStat[]
// 	items: ItemInfo[]
// }