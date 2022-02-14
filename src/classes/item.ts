import { Stat } from './stats'

export interface ItemInfo {
	itemId: number
	itemName: string
	icon: string
}

export class Item extends Stat implements ItemInfo {
	itemName: string
	itemId: number
	icon: string
    from: Item[]
    into: Item[]
    hasStats: boolean
	constructor(info: ItemInfo, stats?: OneStat[]) {
		super(stats || [])
		this.itemId = info.itemId
		this.itemName = info.itemName
		this.icon = info.icon
        this.hasStats = (stats !== undefined)
	}
	addStats(stats: OneStat[]) {
		const info: ItemInfo = {
			itemId: this.itemId,
			itemName: this.itemName,
			icon: this.icon,
		}
		return new Item(info, stats)
	}
}
