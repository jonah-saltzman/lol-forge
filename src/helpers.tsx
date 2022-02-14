import React from "react"
import Fuse from 'fuse.js'
import { SelectSearchOption } from "react-select-search"

type ChampItem = {name: string, value: number}

export function champSearch(options: SelectSearchOption[]) {
	const fuse = new Fuse<SelectSearchOption>(options, {
		keys: ['name'],
		threshold: 0.3,
	})

	return (query: string) => {
		if (!query.length) {
			return []
		}
		return fuse.search(query).map(res => res.item)
	}
}