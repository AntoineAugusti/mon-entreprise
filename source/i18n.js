import i18next from 'i18next'
import queryString from 'query-string'
import enTranslations from './locales/en.yaml'
import { getIframeOption, parseDataAttributes } from './utils'

let getFromSessionStorage = where =>
	typeof sessionStorage !== 'undefined' ? sessionStorage[where] : null

let setToSessionStorage = (where, what) =>
	typeof sessionStorage !== 'undefined' &&
	do {
		sessionStorage[where] = what
	}

let lang =
	getIframeOption('lang') ||
	queryString.parse(location.search)['lang'] ||
	parseDataAttributes(getFromSessionStorage('lang')) ||
	'fr'
console.log('i18n', lang)

setToSessionStorage('lang', lang)
i18next.init(
	{
		debug: false,
		lng: lang,
		resources: {
			en: {
				translation: enTranslations
			}
		}
	},
	(err, t) => {
		console.log('Error from i18n load', err, t) //eslint-disable-line no-console
	}
)

export default lang
