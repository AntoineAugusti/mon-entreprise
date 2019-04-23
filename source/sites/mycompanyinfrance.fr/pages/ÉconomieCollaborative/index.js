import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route } from 'react-router'
import ActivitésSelection from './ActivitésSelection'
import CoConsommation from './CoConsommation'
import Home from './Home'
import LocationMeublée from './LocationMeublée'
export default withSitePaths(function ÉconomieCollaborative({ sitePaths }) {
	return (
		<>
			<Route
				exact
				path={sitePaths.économieCollaborative.index}
				component={Home}
			/>
			<Route
				exact
				path={sitePaths.économieCollaborative.activités.index}
				component={ActivitésSelection}
			/>
			<Route
				exact
				path={sitePaths.économieCollaborative.activités.locationMeublée}
				component={LocationMeublée}
			/>
			<Route
				exact
				path={sitePaths.économieCollaborative.activités.coConsommation}
				component={CoConsommation}
			/>
		</>
	)
})
