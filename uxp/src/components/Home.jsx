import React, { useState, useEffect } from 'react'
import { Button } from '@adobe/react-spectrum'

const app = window.require('indesign').app

export const Home = () => {
	const [availableStyles, setAvailableStyles] = useState([])
	const [styleToReplace, setStyleToReplace] = useState()
	const [styleToReplaceTo, setStyleToReplaceTo] = useState()

	useEffect(() => {
		// prepare a list of available styles to replace (those used within the active spread)
		const pageItems = app.activeWindow.activeSpread.allPageItems
		const initialStyles = []
		pageItems.map(pageItem => {
			const appliedStyle = pageItem.appliedObjectStyle
			if (!initialStyles.filter(style => style.name === appliedStyle.name).length) {
				initialStyles.push({
					name: appliedStyle.name,
					style: appliedStyle,
				})
			}
		})
		setAvailableStyles(initialStyles)
	}, [])

	const replaceStyles = () => {
		let affectedItems = 0
		const targetStyle = availableStyles.find(style => style.name === styleToReplaceTo)
		// iterate page items
		const pageItems = app.activeWindow.activeSpread.allPageItems
		pageItems.map(pageItem => {
			const appliedStyle = pageItem.appliedObjectStyle
			// if the applied style of the iterated item is different than the target one, replace it
			if (appliedStyle.name === styleToReplace && targetStyle) {
				pageItem.applyObjectStyle(targetStyle.style)
				affectedItems++
			}
		})
		// log results
		if (affectedItems) {
			alert(`Affected ${affectedItems} items`)
		}
	}

	return (
		<div>
			<div>
				<h3>Style to replace</h3>
				<select
					onChange={e => {
						setStyleToReplace(e.target.value)
					}}>
					{availableStyles.map(availableStyle => (
						<option key={`from_${availableStyle.name}`}>{availableStyle.name}</option>
					))}
				</select>
				<h3>Style to replace to</h3>
				<select
					onChange={e => {
						setStyleToReplaceTo(e.target.value)
					}}>
					{['Black Box', 'White Box', '[None]']
						.filter(style => style !== styleToReplace)
						.map(style => (
							<option key={`to_${style}`}>{style}</option>
						))}
				</select>
			</div>
			<Button variant={'primary'} onClick={replaceStyles}>
				Replace
			</Button>
		</div>
	)
}
