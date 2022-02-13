import { Champ, ChampInfo } from "../classes/champ";
import call from "./caller";

export const getChamps = async (): Promise<Champ[]> => {
    const res = await call('/champs', 'GET')
    const champInfo = await res.json() as ChampInfo[]
    return champInfo.map(info => new Champ(info))
}