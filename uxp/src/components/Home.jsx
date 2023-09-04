import React, { useState, useEffect } from 'react'
import { Button } from '@adobe/react-spectrum'

const app = window.require('indesign').app

export const Home = () => {
	const [availableStyles, setAvailableStyles] = useState([])
	const [styleToReplace, setStyleToReplace] = useState()
	const [styleToReplaceTo, setStyleToReplaceTo] = useState()

	useEffect(() => {
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
		const pageItems = app.activeWindow.activeSpread.allPageItems
		const targetStyle = availableStyles.find(style => style.name === styleToReplaceTo).style
		let affectedItems = 0
		pageItems.map(pageItem => {
			const appliedStyle = pageItem.appliedObjectStyle
			if (appliedStyle.name === styleToReplace) {
				pageItem.applyObjectStyle(targetStyle)
				affectedItems++
			}
		})
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
