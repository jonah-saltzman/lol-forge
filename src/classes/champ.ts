import { Stat } from './stats'

export class Champ extends Stat implements ChampInfo {
	champName: string
	champId: number
	title: string
	icon: string
	resourceType: string
    hasStats: boolean
    statsArr?: OneStat[]
	constructor(info: ChampInfo, stats?: OneStat[]) {
		super(stats || [])
        this.champId = info.champId
        this.champName = info.champName
        this.icon = info.icon
        this.resourceType = info.resourceType
        this.hasStats = (stats !== undefined)
        if (this.hasStats) this.statsArr = stats
	}
    addStats(stats: OneStat[]) {
        const info: ChampInfo = {
            champId: this.champId,
            champName: this.champName,
            title: this.title,
            icon: this.icon,
            resourceType: this.resourceType
        }
        return new Champ(info, stats)
    }
}