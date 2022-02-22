import { Stat } from './stats'

export class Item extends Stat implements ItemInfoI {
	itemName: string
	itemId: number
	icon: string
    from: Item[]
    into: Item[]
    hasStats: boolean
    stats: OneStat[]
	constructor(info: ItemInfoI, stats?: OneStat[]) {
		super(stats || [])
		this.itemId = info.itemId
		this.itemName = info.itemName
		this.icon = info.icon
        this.hasStats = (stats !== undefined)
        if (stats) {
            this.stats = stats
        }
	}
	addStats(stats: OneStat[]) {
		const info: ItemInfoI = {
			itemId: this.itemId,
			itemName: this.itemName,
			icon: this.icon,
		}
		return new Item(info, stats)
	}
}
