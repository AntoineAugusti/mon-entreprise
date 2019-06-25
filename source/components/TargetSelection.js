import classNames from 'classnames'
import { T } from 'Components'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import PeriodSwitch from 'Components/PeriodSwitch'
import RepartitionField from 'Components/RepartitionField'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules'
import { compose, isEmpty, isNil, propEq } from 'ramda'
import React, { Component, PureComponent } from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { change, Field } from 'redux-form'
import {
	analysisWithDefaultsSelector,
	flatRulesSelector
} from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'
import AnimatedTargetValue from 'Ui/AnimatedTargetValue'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import './TargetSelection.css'

export default compose(
	withTranslation(),
	withColours,
	connect(
		state => ({
			analysis: analysisWithDefaultsSelector(state),
			flatRules: flatRulesSelector(state),
			activeInput: state.activeTargetInput,
			objectifs: state.simulation?.config.objectifs || []
		}),
		dispatch => ({
			setFormValue: (field, name) =>
				dispatch(change('conversation', field, name)),
			setActiveInput: name =>
				dispatch({ type: 'SET_ACTIVE_TARGET_INPUT', name })
		})
	)
)(
	class TargetSelection extends PureComponent {
		state = {
			initialRender: true
		}
		componentDidMount() {
			if (this.state.initialRender) {
				this.setState({ initialRender: false })
			}
		}
		render() {
			let {
					colours,
					analysis,
					activeInput,
					setActiveInput,
					setFormValue,
					objectifs
				} = this.props,
				targets = analysis?.targets || []

			return (
				<div id="targetSelection">
					{(typeof objectifs[0] === 'string' ? [{ objectifs }] : objectifs).map(
						({ icône, objectifs: groupTargets, nom }, index) => (
							<React.Fragment key={nom}>
								<div style={{ display: 'flex', alignItems: 'end' }}>
									<div style={{ flex: 1 }}>
										{nom && (
											<h2 style={{ marginBottom: 0 }}>
												{emoji(icône)} <T>{nom}</T>
											</h2>
										)}
									</div>
									{index === 0 && <PeriodSwitch />}
								</div>
								<section
									className="ui__ plain card"
									style={{
										marginTop: '.6em',
										color: colours.textColour,
										background: `linear-gradient(
								60deg,
								${colours.darkColour} 0%,
								${colours.colour} 100%
								)`
									}}>
									<Targets
										{...{
											activeInput,
											setActiveInput,
											setFormValue,
											targets: targets.filter(({ dottedName }) =>
												groupTargets.includes(dottedName)
											),
											initialRender: this.state.initialRender
										}}
									/>
								</section>
							</React.Fragment>
						)
					)}
				</div>
			)
		}
	}
)

let Targets = ({
	activeInput,
	setActiveInput,
	setFormValue,
	targets,
	initialRender
}) => (
	<div>
		<ul className="targets">
			{targets
				.map(target => target.explanation || target)
				.filter(target => {
					return (
						target.isApplicable !== false &&
						(target.question || target.nodeValue)
					)
				})
				.map(target => (
					<Target
						key={target.dottedName}
						initialRender={initialRender}
						{...{
							target,
							setFormValue,
							activeInput,
							setActiveInput,
							targets
						}}
					/>
				))}
		</ul>
	</div>
)

const Target = ({
	target,
	activeInput,

	targets,
	setActiveInput,
	setFormValue,
	initialRender
}) => {
	const isSmallTarget =
		!target.question || !target.formule || isEmpty(target.formule)

	return (
		<li
			key={target.name}
			className={isSmallTarget ? 'small-target' : undefined}>
			<Animate.appear unless={initialRender}>
				<div>
					<div className="main">
						<Header
							{...{
								target,

								isActiveInput: activeInput === target.dottedName
							}}
						/>
						{isSmallTarget && (
							<span
								style={{
									flex: 1,
									borderBottom: '1px dashed #ffffff91',
									marginLeft: '1rem'
								}}
							/>
						)}
						<TargetInputOrValue
							{...{
								target,
								targets,
								activeInput,
								setActiveInput,
								setFormValue
							}}
						/>
					</div>
					{activeInput === target.dottedName && (
						<Animate.fromTop>
							<InputSuggestions
								suggestions={target.suggestions}
								onFirstClick={value => {
									setFormValue(target.dottedName, '' + value)
								}}
								rulePeriod={target.période}
								colouredBackground={true}
							/>
						</Animate.fromTop>
					)}
				</div>
			</Animate.appear>
		</li>
	)
}

let Header = withSitePaths(({ target, sitePaths }) => {
	const ruleLink =
		sitePaths.documentation.index + '/' + encodeRuleName(target.dottedName)
	return (
		<span className="header">
			<span className="texts">
				<span className="optionTitle">
					<Link to={ruleLink}>{target.title || target.name}</Link>
				</span>
				<p>{target.summary}</p>
			</span>
		</span>
	)
})

let CurrencyField = withColours(props => {
	return (
		<CurrencyInput
			style={{
				color: props.colours.textColour,
				borderColor: props.colours.textColour
			}}
			debounce={600}
			className="targetInput"
			value={props.input.value}
			{...props.input}
			{...props}
		/>
	)
})
let DebouncedRepartitionField = props => (
	<RepartitionField debounce={600} {...props} />
)

let TargetInputOrValue = withLanguage(
	({
		target,
		targets,
		activeInput,
		setActiveInput,
		language,
		firstStepCompleted
	}) => {
		let inputIsActive = activeInput === target.dottedName
		return (
			<span className="targetInputOrValue">
				{inputIsActive || !target.formule || isEmpty(target.formule) ? (
					<Field
						name={target.dottedName}
						onBlur={event => event.preventDefault()}
						component={
							{ euros: CurrencyField, pourcentage: DebouncedRepartitionField }[
								target.format
							]
						}
						{...(inputIsActive ? { autoFocus: true } : {})}
						language={language}
					/>
				) : (
					<TargetValue
						{...{
							targets,
							target,
							activeInput,
							setActiveInput,
							firstStepCompleted
						}}
					/>
				)}
			</span>
		)
	}
)

const TargetValue = connect(
	state => ({
		blurValue: analysisWithDefaultsSelector(state)?.cache.inversionFail
	}),
	dispatch => ({
		setFormValue: (field, name) => dispatch(change('conversation', field, name))
	})
)(
	class TargetValue extends Component {
		render() {
			let { targets, target, blurValue } = this.props

			let targetWithValue =
					targets && targets.find(propEq('dottedName', target.dottedName)),
				value = targetWithValue && targetWithValue.nodeValue

			return (
				<div
					className={classNames({
						editable: target.question,
						attractClick: target.question && isNil(target.nodeValue)
					})}
					style={blurValue ? { filter: 'blur(3px)' } : {}}
					{...(target.question ? { tabIndex: 0 } : {})}
					onClick={this.showField(value)}
					onFocus={this.showField(value)}>
					<AnimatedTargetValue value={value} />
				</div>
			)
		}
		showField(value) {
			let { target, setFormValue, activeInput, setActiveInput } = this.props
			return () => {
				if (!target.question) return
				if (value != null && !Number.isNaN(value))
					setFormValue(target.dottedName, Math.round(value) + '')

				if (activeInput) setFormValue(activeInput, '')
				setActiveInput(target.dottedName)
			}
		}
	}
)
