import call from "./caller";

import { BuildInfo, Build } from "../classes/build";

interface BuildResponse {
    data: BuildInfo[]
}

export const getAllBuilds = async (token: string): Promise<BuildInfo[]> => {
    const res = await call('/', 'GET', {token})
    if (res.status !== 200) return []
    const data = await res.json() as BuildResponse
    const infos = data.data
    if (!infos) return null
    return infos
}

export const createBuild = async (token: string, build: Build): Promise<BuildInfo> => {
    const res = await call('/new', 'POST', {token, ...build.toObject()})
    if (res.status !== 200) return null
    return await res.json() as BuildInfo
}

export const patchBuild = async (token: string, build: Build): Promise<BuildInfo> => {
    const res = await call('/', 'PATCH', {token, ...build.toObject()})
    if (res.status !== 200) return null
    return (await res.json()).data as BuildInfo
}

export const deleteBuild = async (token: string, build: Build): Promise<boolean> => {
    return (await call('/', 'DELETE', {token, buildId: build.buildId})).status === 200
}