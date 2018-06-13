import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { withAPIEndpoints, withLambda, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActionsMenu } from 'Modules/Actions';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Button } from 'components/Buttons';
import { Row, Col } from 'react-flexybox';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import { Tabs, Tab } from 'components/Tabs';
import { Logging } from 'Modules/Logging';
import { Card } from 'components/Cards';
import { FullPageFooter } from 'components/FullPage';
import LambdaForm from './LambdaForm';
import validate from '../validations';
import { generatePatches } from '../payloadTransformer';
import { getEditLambdaModel, selectLambda } from '../selectors';
import withLambdaState from '../hoc/withLambdaState';
import runTimes from '../lists/runTimes';
import ListIcon from '../components/ListIcon';

class LambdaEdit extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    lambda: PropTypes.object.isRequired,
    lambdaActions: PropTypes.object.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    providersData: PropTypes.array.isRequired,
    executorsData: PropTypes.array.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    lambdaStateActions: PropTypes.object.isRequired,
  };

  state = { runtime: null };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.lambda.properties.runtime !== prevState.runtime) {
      const runtime = runTimes.find(rt => rt.value === nextProps.lambda.properties.runtime) || {};

      return {
        runtime,
      };
    }

    return null;
  }

  componentDidMount() {
    const { match, lambdaActions, apiEndpointsActions } = this.props;

    lambdaActions.fetchLambda({ fqon: match.params.fqon, lambdaId: match.params.lambdaId });
    apiEndpointsActions.fetchAPIEndpoints({ fqon: match.params.fqon, params: { implementation_type: 'lambda', implementation_id: match.params.lambdaId } });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.runtime.value !== prevState.runtime.value) {
      this.props.lambdaStateActions.setRunTime(this.state.runtime);
    }
  }

  componentWillUnmount() {
    const { lambdaStateActions } = this.props;

    lambdaStateActions.setRunTime({});
  }

  update = (values) => {
    const { lambda, match, lambdaActions } = this.props;
    const payload = generatePatches(lambda, values);

    lambdaActions.updateLambda({ fqon: match.params.fqon, lambdaId: lambda.id, payload });
  }

  showEntitlements = () => {
    const { entitlementActions, lambda, match } = this.props;

    entitlementActions.showEntitlementsModal(lambda.name, match.params.fqon, lambda.id, 'lambdas', 'Lambda');
  }

  handleSaveInlineCode = (values) => {
    const { lambda, match, lambdaActions } = this.props;
    const payload = generatePatches(lambda, values);

    lambdaActions.updateLambda({ fqon: match.params.fqon, lambdaId: lambda.id, payload, noPending: true });
  }

  render() {
    const { match,
      lambda,
      lambdaPending,
      initialFormValues,
      providersData,
      executorsData,
      apiEndpoints,
      apiEndpointsPending,
      lambdaStateActions,
    } = this.props;

    return (
      lambdaPending && !lambda.id ?
        <ActivityContainer id="lambda-load" /> :
        <Row center>
          <Col flex={10} xs={12} sm={12} md={10}>
            <ActionsToolbar
              title={<ListIcon runtime={lambda.properties.runtime} label={lambda.name} />}
              actions={[
                <Button
                  key="lambda--log"
                  flat
                  iconChildren="subject"
                  to={{
                    pathname: '/logs',
                    search: `?name=${lambda.name}&fqon=${match.params.fqon}&providerId=${lambda.properties.provider.id}&logType=lambda&logId=${lambda.id}`
                  }}
                  target="_blank"
                  component={Link}
                >
                  Expand Log
                </Button>,
                <ActionsMenu
                  key="lambda--actions"
                  model={lambda}
                  fqon={match.params.fqon}
                  // actionList={[]}
                  // pending={actionsPending}
                />,
                <Button
                  key="lambda--entitlements"
                  flat
                  iconChildren="security"
                  onClick={this.showEntitlements}
                >
                  Entitlements
                </Button>
              ]}
            />

            {lambdaPending && <ActivityContainer id="lambda-form" />}

            <Tabs>
              <Tab title="Lambda">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Panel title="Resource Details" defaultExpanded={false}>
                      <DetailsPane model={lambda} />
                    </Panel>
                  </Col>
                </Row>

                <Row gutter={5}>
                  <Col flex={12}>
                    <Panel title="Public Endpoints" pending={apiEndpointsPending && !apiEndpoints.length} noPadding count={apiEndpoints.length}>
                      <APIEndpointInlineList
                        onAddEndpoint={() => lambdaStateActions.showAPIEndpointWizardModal(match.params, lambda.id, 'lambda')}
                      />
                    </Panel>
                  </Col>
                </Row>

                <Form
                  editMode
                  onSubmit={this.update}
                  initialValues={initialFormValues}
                  render={LambdaForm}
                  validate={validate}
                  mutators={{ ...arrayMutators }}
                  loading={lambdaPending}
                  providers={providersData}
                  executors={executorsData}
                  lambda={lambda}
                  apiEndpoints={apiEndpoints}
                  apiEndpointsPending={apiEndpointsPending}
                  onSaveInlineCode={this.handleSaveInlineCode}
                />
              </Tab>
              <Tab title="Log">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <Logging
                        name={lambda.name}
                        logType="lambda"
                        logId={lambda.id}
                        providerId={lambda.properties.provider.id}
                        fqon={match.params.fqon}
                      />
                    </Card>
                  </Col>
                </Row>

                <FullPageFooter>
                  <Button
                    flat
                    iconChildren="arrow_back"
                    component={Link}
                    to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/lambdas`}
                  >
                    Lambdas
                  </Button>
                </FullPageFooter>
              </Tab>
            </Tabs>
          </Col>
        </Row>
    );
  }
}

const mapStateToProps = state => ({
  lambda: selectLambda(state),
  initialFormValues: getEditLambdaModel(state),
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'Lambda' } }),
  withPickerData({ entity: 'providers', alias: 'executors', label: 'Executors', params: { type: 'Executor' }, }),
  withLambdaState,
  withLambda,
  withAPIEndpoints(),
  withEntitlements,
  connect(mapStateToProps),
)(LambdaEdit);
