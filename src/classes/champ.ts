import { Stat } from './stats'

export interface ChampInfo {
    champId: number
    champName: string
    title: string
    icon: string
    resourceType: string
}

export class Champ extends Stat implements ChampInfo {
	champName: string
	champId: number
	title: string
	icon: string
	resourceType: string
	constructor(info: ChampInfo, stats?: OneStat[]) {
		super(stats || [])
        this.champId = info.champId
        this.champName = info.champName
        this.icon = info.icon
        this.resourceType = info.resourceType
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