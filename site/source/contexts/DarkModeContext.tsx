import React from 'react'

type DarkModeContextType = {
	darkMode: boolean
	setDarkMode: (darkMode: boolean) => void
}

export const DarkModeContext = React.createContext<DarkModeContextType>({
	darkMode: false,
	setDarkMode: () => {
		// eslint-disable-next-line no-console
		console.error('No dark mode provider found')
	},
})

export const DarkModeProvider: React.FC = ({ children }) => {
	const [darkMode, setDarkMode] = React.useState<boolean>(
		import.meta.env.DEV && typeof window !== 'undefined' ?
			(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) :
			false
	)

	return (
		<DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
			{children}
		</DarkModeContext.Provider>
	)
}
