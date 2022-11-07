import { Message } from '@/design-system'
import { Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import SeeAnswersButton from '../conversation/SeeAnswersButton'
import Value from '../EngineValue'

export function CompanyDetails({
	showSituation = false,
}: {
	showSituation?: boolean
}) {
	return (
		<StyledCompanyContainer>
			<Grid
				container
				css={`
					align-items: flex-end;
					justify-content: center;
				`}
				spacing={3}
			>
				<Grid item xs={12} lg>
					<H4 data-test-id="currently-selected-company" as="h3">
						{' '}
						<Value expression="entreprise . nom" linkToRule={false} />{' '}
						<Value expression="entreprise . SIREN" linkToRule={false} />
					</H4>
					<Body>
						<Trans>
							Entreprise créée le{' '}
							<Strong>
								<Value
									expression="entreprise . date de création"
									linkToRule={false}
								/>
							</Strong>{' '}
							et domiciliée à{' '}
							<Strong>
								<Value
									expression="établissement . commune"
									linkToRule={false}
								/>
							</Strong>
						</Trans>
					</Body>
				</Grid>
				{showSituation && (
					<Grid item xs={12} sm="auto">
						<SeeAnswersButton label={<Trans>Afficher le détail</Trans>} />
						<Spacing sm />
					</Grid>
				)}
			</Grid>
		</StyledCompanyContainer>
	)
}

const StyledCompanyContainer = styled(Message).attrs({ border: false })``
