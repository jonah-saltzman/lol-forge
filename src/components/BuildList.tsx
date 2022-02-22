import React, { useState, useEffect, useContext } from "react";
import { Build } from "../classes/build";
import { Form } from 'react-bootstrap'
import { buildContext, authContext } from '../hooks/context/createContext'
import { Actions } from "../declarations/enums";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const List = (props: ListProps) => {
    const {selected, dispatch} = useContext(buildContext)
    const {auth} = useContext(authContext)
    const [buildName, setBuildName] = useState('')
    const [newBuild, setNewBuild] = useState(false)

    const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuildName(e.target.value)
    }

    const addBuild = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.newBuild(buildName).then(() => {
            setNewBuild(false)
            setBuildName('')
        })
    }

    const editName = (e: React.FormEvent<HTMLFormElement>, buildId: number) => {
        e.preventDefault()
        const [found, i] = findBuild(buildId)
        found.buildName = buildName
        const newArr = [...props.builds]
        newArr[i] = Build.clone(found)
        props.setBuilds(newArr)
        if (selected.buildId === buildId) {
            dispatch({type: Actions.ChangeName, newName: buildName})
        }
        setBuildName('')
    }

    const NameForm = (isNew?: boolean, buildId?: number) => {
        const prevName = props.builds.find(
					(b) => b.buildId === buildId
				).buildName ?? null
        if (!isNew) setBuildName(prevName)
        return (
			<Form onBlur={() => {
                setBuildName('')
                setNewBuild(false)
            }} onSubmit={isNew ? addBuild : (e) => editName(e, buildId)}>
				<input
					className='input'
					placeholder={isNew ? 'Build Name' : prevName}
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
    }

    const selectBuild = (build: Build) => {
        dispatch({ type: Actions.Swap, build: build })
    }

    const deleteBuild = (build: Build) => {
        build.delete(auth.token).then(res => {
            if (res) {
                const [, i] = findBuild(build.buildId)
                const newArr = [...props.builds]
                newArr.splice(i, 1)
                props.setBuilds(newArr)
                if (build.buildId === selected.buildId) {
                    const newSelected = newArr.length
                        ? newArr[i]
                            ? newArr[i]
                            : newArr[i - 1]
                            ? newArr[i - 1]
                            : newArr[i + 1]
                            ? newArr[i + 1]
                            : null
                        : null
                    dispatch({type: Actions.Swap, build: newSelected})
                }
            } else {
                toast('Error deleting build')
            }
        })
    }

    const findBuild = (buildId: number): [Build, number] => {
        const found = props.builds.find((b) => b.buildId === buildId)
		const i = props.builds.indexOf(found)
        return [found, i]
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
								key={props.builds.length + 1 ?? -1}
								onClick={() => setNewBuild(true)}
								className='build-li'>
								{newBuild ? NameForm() : newBuildLi}
							</div>
						) : null}
					</div>
				)
    }
}

export default List