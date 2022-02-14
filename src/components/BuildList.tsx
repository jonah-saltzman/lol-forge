import React from "react";
import { Build } from "../classes/build";

interface ListProps {
    builds: Build[]
    select: (id: number) => void
}

const List = (props: ListProps) => {
    return (
			<div className='build-ul'>
				{props.builds
					? props.builds.map((build) => (
							<div onClick={() => props.select(build.buildId)} className='build-li'>
								{build.buildName}
							</div>
					  ))
					: null}
			</div>
		)
}

export default List