import React from 'react'
import { defaultTheme, Provider } from '@adobe/react-spectrum'
import { Home } from '../components/Home.jsx'

export const Demos = () => {
	return (
		<>
			<Provider theme={defaultTheme} height="100%">
				<Home />
			</Provider>
		</>
	)
}
