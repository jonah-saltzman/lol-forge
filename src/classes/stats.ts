const statData: StatData[] = [
	{
		statId: 0,
		statName: 'armor',
		alias: null,
	},
	{
		statId: 1,
		statName: 'armorPenetration',
		alias: 'armor_penetration',
	},
	{
		statId: 2,
		statName: 'attackDamage',
		alias: 'attack_damage',
	},
	{
		statId: 3,
		statName: 'attackSpeed',
		alias: 'attack_speed',
	},
	{
		statId: 5,
		statName: 'criticalStrikeChance',
		alias: 'critical_strike_chance',
	},
	{
		statId: 6,
		statName: 'goldPer_10',
		alias: 'gold_per_10',
	},
	{
		statId: 7,
		statName: 'healAndShieldPower',
		alias: 'heal_and_shield_power',
	},
	{
		statId: 8,
		statName: 'health',
		alias: null,
	},
	{
		statId: 9,
		statName: 'healthRegen',
		alias: 'health_regen',
	},
	{
		statId: 10,
		statName: 'lethality',
		alias: null,
	},
	{
		statId: 11,
		statName: 'lifesteal',
		alias: 'life_steal',
	},
	{
		statId: 12,
		statName: 'magicPenetration',
		alias: 'magic_penetration',
	},
	{
		statId: 13,
		statName: 'magicResistance',
		alias: 'magic_resistance',
	},
	{
		statId: 14,
		statName: 'mana',
		alias: null,
	},
	{
		statId: 15,
		statName: 'manaRegen',
		alias: 'mana_regen',
	},
	{
		statId: 16,
		statName: 'movespeed',
		alias: null,
	},
	{
		statId: 17,
		statName: 'abilityHaste',
		alias: 'ability_haste;cooldown_reduction;cooldownReduction',
	},
	{
		statId: 18,
		statName: 'omnivamp',
		alias: null,
	},
	{
		statId: 19,
		statName: 'tenacity',
		alias: null,
	},
	{
		statId: 20,
		statName: 'abilityPower',
		alias: 'ability_power',
	},
	{
		statId: 21,
		statName: 'criticalStrikeDamage',
		alias: 'critical_strike_damage',
	},
	{
		statId: 22,
		statName: 'criticalStrikeDamageModifier',
		alias: 'critical_strike_damage_modifier',
	},
	{
		statId: 23,
		statName: 'attackSpeedRatio',
		alias: 'attack_speed_ratio',
	},
	{
		statId: 24,
		statName: 'attackCastTime',
		alias: 'attack_cast_time',
	},
	{
		statId: 25,
		statName: 'attackTotalTime',
		alias: 'attack_total_time',
	},
]


export class Stat {
    public static _AP = 'abilityPower'
    public static _armor = 'armor'
    public static _armorPen = 'armorPenetration'
    public static _AD = 'attackDamage'
    public static _AS = 'attackSpeed'
    public static _AH = 'abilityHaste'
    public static _critChance = 'criticalStrikeChance'
    public static _HSP = 'healAndShieldPower'
    public static _health = 'health'
    public static _HR = 'healthRegen'
    public static _lethality = 'lethality'
    public static _LS = 'lifesteal'
    public static _MP = 'magicPenetration'
    public static _MR = 'magicResistance'
    public static _mana = 'mana'
    public static _manaRegen = 'manaRegen'
    public static _MS = 'movespeed'
    public static _OV = 'omnivamp'
    public static _tenacity = 'tenacity'
    AP: Mods
    armor: Mods
    AD: Mods
    AS: Mods
    AH: Mods
    critChance: Mods
    HSP: Mods
    health: Mods
    HR: Mods
    lethality: Mods
    LS: Mods
    MP: Mods
    MR: Mods
    mana: Mods
    manaRegen: Mods
    MS: Mods
    OV: Mods
    tenacity: Mods
    armorPen: Mods
    constructor(stats: OneStat[]) {
        if (stats.length === 0) {
            return
        }
        for (const stat of stats) {
            const name = statData.find(prop => prop.statId === stat.statId).statName
            const mods: Mods = {
                flat: stat.flat,
                percent: stat.percent,
                perLevel: stat.perLevel,
            }
            switch (name) {
                case 'abilityPower':
                    this.AP = mods
                    break
                case 'armor':
                    this.armor = mods
                    break
                case 'armorPenetration':
                    this.armorPen = mods
                    break
                case 'attackDamage':
                    this.AD = mods
                    break
                case 'attackSpeed':
                    this.AS = mods
                    break
                case 'abilityHaste':
                    this.AH = mods
                    break
                case 'criticalStrikeChance':
                    this.critChance = mods
                    break
                case 'healAndShieldPower':
                    this.HSP = mods
                    break
                case 'health':
                    this.health = mods
                    break
                case 'healthRegen':
                    this.HR = mods
                    break
                case 'lethality':
                    this.lethality = mods
                    break
                case 'lifesteal':
                    this.LS = mods
                    break
                case 'magicPenetration':
                    this.MP = mods
                    break
                case 'magicResistance':
                    this.MR = mods
                    break
                case 'mana':
                    this.mana = mods
                    break
                case 'manaRegen':
                    this.manaRegen = mods
                    break
                case 'movespeed':
                    this.MS = mods
                    break
                case 'omnivamp':
                    this.OV = mods
                    break
                case 'tenacity':
                    this.tenacity = mods
                    break
                default:
                    break
            }
        }
    }
}