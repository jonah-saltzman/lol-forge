import React, { useState, createRef, LegacyRef, useEffect } from "react";
import { Build } from "../classes/build";
import { Form } from 'react-bootstrap'

interface ListProps {
    builds: Build[]
    select: (id?: number) => void
    addBuild: (name: string) => void
    authed: boolean
}

const List = (props: ListProps) => {
    const [buildName, setBuildName] = useState('')
    const [newBuild, setNewBuild] = useState(false)
    const inputRef = createRef<HTMLInputElement>()
    const formRef = createRef<HTMLInputElement>()

    const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuildName(e.target.value)
    }

    const changeName = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.addBuild(buildName)
        setNewBuild(false)
        setBuildName('')
    }

    useEffect(() => {
        if (!newBuild) return
        else inputRef.current.focus()
    })

    const nameForm = (
			<Form onBlur={() => {
                setBuildName('')
                setNewBuild(false)
                
            }} onSubmit={changeName}>
				<input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
					className='input'
					placeholder='Build Name'
                    autoFocus
					value={buildName}
					onChange={nameChange}
					onBlur={() => {
						setBuildName('')
						setNewBuild(false)
					}}
				/>
			</Form>
		)

    const newBuildLi = (<span className="new-build">New Build</span>)

    return (
			<div className='build-ul'>
				{props.builds
					? props.builds.map((build, i) => (
							<div
								key={i}
								onClick={() => props.select(build.buildId)}
								className='build-li'>
								{build.buildName}
							</div>
					  ))
					: null}
				{props.authed ? (
					<div
						key={props.builds.length + 1 && -1}
						onClick={() => setNewBuild(true)}
						className='build-li'>
						{newBuild ? nameForm : newBuildLi}
					</div>
				) : null}
			</div>
		)
}

export default List