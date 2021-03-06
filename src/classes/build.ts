import { patchBuild, createBuild, deleteBuild } from "../api/builds";
import { getChampStats, getItemStats } from "../api/info";
import { Champ } from "./champ";
import { Item } from "./item";
import { Actions } from "../declarations";

export class Build {
	buildName?: string
	champ: Champ
	items: Item[]
	buildId?: number
	saved: boolean
    previousInfo: BuildInfo
    hash: number
	constructor(
		info?: BuildInfo,
		champC?: ChampContext,
		itemC?: ItemContext,
		champ?: Champ,
		items?: Item[],
        build?: Build
	) {
        if (build) {
            this.buildName = build.buildName
            this.champ = build.champ
            this.items = build.items
            this.buildId = build.buildId
            this.saved = build.saved
            this.previousInfo = this.getBuildInfo()
            this.hash = this.currentHash()
            return
        }
		this.buildName = info.buildName
		this.champ = champ
			? champ
			: champC.addChampStats(info.champId, info.champStats)
		this.items = items
			? items
			: info.items.map((item) => {
					return itemC.addItemStats(item.itemId, item.statsArray)
			  }) ?? ([] as Item[])
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
	async changeChamp(newChamp: Champ, champC: ChampContext): Promise<Build> {
		if (newChamp.hasStats) {
			this.champ = newChamp
			return this
		} else {
			const stats = await getChampStats(newChamp.champId)
			this.champ = champC.addChampStats(newChamp.champId, stats)
			return this
		}
	}
	async save(token: string): Promise<Build> {
		if (this.buildId) {
            if (!this.needSave()) return this
			if (this.verifyResponse(await patchBuild(token, this))) return this.wasSaved()
		} else {
			const newBuildInfo = await createBuild(token, this)
			if (newBuildInfo) {
				this.buildId = newBuildInfo.buildId
				return this.wasSaved()
			} else {
				throw new Error('Failed to save build')
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
            from: item.from,
            into: item.into,
            statsArray: item.statsArray,
            itemName: item.itemName,
            icon: item.icon,
            isNull: false
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
        return !this.saved
        // const current = info ? info : this.getBuildInfo()
        // return (this.previousInfo.buildName !== current.buildName)
        //     || (this.previousInfo.champId !== current.champId)
        //     || (this.previousInfo.items.length !== current.items.length)
        //     || (current.items.some((currentItem, i) => currentItem.itemId !== this.previousInfo.items[i].itemId))
    }
    public static clone(build: Build): Build {
        const old = build
        const n = new Build(undefined, undefined, undefined, undefined, undefined, build)
        n.previousInfo = old.previousInfo
        return n
    }
    wasSaved(): Build {
        this.previousInfo = this.getBuildInfo()
        this.saved = true
        return this
    }
    reduce(action: BuildAction): Build {
        switch(action.type) {
            case Actions.ChangeName:
                this.buildName = action.newName
                return this
            case Actions.AddBuildId:
                this.buildId = action.buildId
                return this
            case Actions.ChangeChamp:
                this.champ = action.newChamp
                return this
            case Actions.PushItem:
                if (this.items.length >= 6) return this
                this.items.push(action.item)
                return this
            case Actions.MoveItem:
                const currentPos = this.items.findIndex(i => i.itemId === action.payload.itemId)
                if (currentPos === -1) return this
                if (this.items[action.payload.newPosition]) {
                    const temp = this.items[action.payload.newPosition]
                    this.items[action.payload.newPosition] = this.items[currentPos]
                    this.items[currentPos] = temp
                    return this
                } else {
                    if (action.payload.newPosition >= this.items.length) {
                        const newArray = new Array(action.payload.newPosition + 1).fill(null)
                        this.items.forEach((item, i) => newArray[i] = item)
                        newArray[currentPos] = null
                        newArray[action.payload.newPosition] = this.items[currentPos]
                        console.log('newArray: ')
                        console.log(newArray)
                        this.items = newArray
                        return this
                    }
                    this.items[action.payload.newPosition] = this.items[currentPos]
                    return this
                }
            case Actions.PopItem:
                if (isPopById(action.payload)) {
                    this.items = this.items.filter(i => i.itemId !== action.payload.itemId)
                } else if (isPopByPos(action.payload)) {
                    this.items.splice(action.payload.position, 1)
                }
                return this
            case Actions.Swap:
                return Build.clone(action.build)
            default:
                return this
        }
    }
    currentHash(): number {
        return hash(JSON.stringify(this.getBuildInfo()))
    }
    updateHash(): Build {
        this.hash = this.currentHash()
        return this
    }
}

const isPopById = (payload: PopItem): payload is PopItemById => !!payload.itemId
const isPopByPos = (payload: PopItem): payload is PopItemByPos => !!payload.position || payload.position === 0

function hash(input: string): number {
	let hash = 0,
		i,
		chr
	if (input.length === 0) return hash
	for (i = 0; i < input.length; i++) {
		chr = input.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}