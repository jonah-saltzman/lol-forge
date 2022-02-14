import React from "react"
import Fuse from 'fuse.js'
import { Champ } from "./classes/champ"

type Item = {name: string, value: number}

export function createSearch(options: Item[]) {
	const fuse = new Fuse<Item>(options, {
		keys: ['name'],
		threshold: 0.6,
	})

	return (query: string) => {
		if (!query.length) {
			return []
		}
		return fuse.search(query).map(res => res.item)
	}
}

export function icon(asset: Champ): string
export function icon(asset: Item): string 
export function icon(asset: any): string {
    return asset.icon
}