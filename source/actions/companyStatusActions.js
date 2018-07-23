/* @flow */
import type {
	ChooseCompanyLiabilityAction,
	CompanyLiability,
	CompanyHaveMultipleAssociatesAction,
	DirectorStatus,
	CompanyIsMicroenterpriseAction,
	DefineDirectorStatusAction
} from 'Types/companyStatusTypes'
import type { RouterHistory } from 'react-router'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'

const thenGoToNextQuestion = actionCreator => (...args: any) => (
	dispatch: any => void,
	getState: () => any,
	history: RouterHistory
) => {
	dispatch(actionCreator(...args))
	history.push(nextQuestionUrlSelector(getState()))
}

export const chooseCompanyLiability = thenGoToNextQuestion(
	(setup: ?CompanyLiability): ChooseCompanyLiabilityAction => ({
		type: 'CHOOSE_COMPANY_LEGAL_SETUP',
		setup
	})
)

export const defineDirectorStatus = thenGoToNextQuestion(
	(status: ?DirectorStatus): DefineDirectorStatusAction => ({
		type: 'DEFINE_DIRECTOR_STATUS',
		status
	})
)

export const companyHaveMultipleAssociates = thenGoToNextQuestion(
	(multipleAssociates: ?boolean): CompanyHaveMultipleAssociatesAction => ({
		type: 'COMPANY_HAVE_MULTIPLE_ASSOCIATES',
		multipleAssociates
	})
)

export const companyIsMicroenterprise = thenGoToNextQuestion(
	(microenterprise: ?boolean): CompanyIsMicroenterpriseAction => ({
		type: 'COMPANY_IS_MICROENTERPRISE',
		microenterprise
	})
)
