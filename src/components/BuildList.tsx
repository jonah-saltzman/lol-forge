import React, { useState, useEffect, useContext } from "react";
import { Build } from "../classes/build";
import { Form } from 'react-bootstrap'
import { buildContext } from '../hooks/context/createContext'
import { Actions } from "../declarations/enums";
import {Spinner} from "react-bootstrap";

const List = (props: ListProps) => {
    const {selected, dispatch} = useContext(buildContext)
    const [buildName, setBuildName] = useState('')
    const [newBuild, setNewBuild] = useState(false)

    const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuildName(e.target.value)
    }

    const changeName = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.addBuild(buildName)
        setNewBuild(false)
        setBuildName('')
    }

    const nameForm = (
			<Form onBlur={() => {
                setBuildName('')
                setNewBuild(false)
                
            }} onSubmit={changeName}>
				<input
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

    const selectBuild = (build: Build) => {
        dispatch({ type: Actions.Swap, build: build })
    }

    const newBuildLi = (<span className="new-build">New Build</span>)
    if (props.loading) {
        return (
            <Spinner animation='border' className="list-spinner" />
        )
    } else {
        return (
					<div className='build-ul'>
						{props.builds
							? props.builds.map((build, i) => (
									<div
										key={i}
										onClick={() => {
											selectBuild(build)
										}}
										className={
											'build-li ' +
											(selected
												? selected.buildId === build.buildId
													? 'selected-build'
													: null
												: null)
										}>
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
}

export default List