import React from "react"
import Fuse from 'fuse.js'

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