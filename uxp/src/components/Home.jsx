import React, { useState, useEffect } from 'react'
import { Button } from '@adobe/react-spectrum'

export const Home = () => {
	const [availableStyles, setAvailableStyles] = useState(['Black', 'White', 'Green']) // this would have been filled on load

	useEffect(() => {
		const app = window.require('indesign').app
		const pageItems = app.activeWindow.activeSpread.allPageItems
		// page items is an empty object?
		// for (let i = 0; i < pageItems.length; i++) {
		// 	console.log(pageItems[i])
		// }

		// TODO

		// fill availableStyles based on styles available in document
	}, [])

	// TODO: add a handler that records the "from" and "to" styles when the select boxes change value

	// TODO: add a handler called from the Button that does the style replace

	return (
		<div>
			<div>
				<h2>Style to replace</h2>
				<select
					onChange={e => {
						// not firing event handler?
						console.log(e)
					}}>
					{availableStyles.map(activeStyle => (
						<option key={activeStyle}>{activeStyle}</option>
					))}
				</select>
			</div>
			{/* Spectrum button styling is buggy? */}
			<Button variant={'primary'}>Replace</Button>
		</div>
	)
}
