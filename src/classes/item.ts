import { Stat } from './stats'

export class Item extends Stat implements ItemInfoI {
	itemName: string
	itemId: number
	icon: string
    from: number[]
    into: number[]
    hasStats: boolean
    statsArray: OneStat[]
	constructor(info: ItemInfo, stats?: OneStat[]) {
		super(stats || [])
		this.itemId = info.itemId
		this.itemName = info.itemName
		this.icon = info.icon
        this.hasStats = (stats !== undefined)
        this.from = info.from
        this.into = info.into
        if (stats) {
            this.statsArray = stats
        }
	}
	addStats(stats: OneStat[]) {
		const info: ItemInfo = {
			itemId: this.itemId,
			itemName: this.itemName,
			icon: this.icon,
            from: this.from,
            into: this.into,
            statsArray: null
		}
		return new Item(info, stats)
	}
}
