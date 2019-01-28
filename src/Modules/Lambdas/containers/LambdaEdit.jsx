import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEqual from 'react-fast-compare';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Button } from 'components/Buttons';
import { Row, Col } from 'react-flexybox';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import { Tabs, Tab } from 'components/Tabs';
import { Logging } from 'Modules/Logging';
import { Card } from 'components/Cards';
import PayloadViewer from '../components/PayloadViewer';
import LambdaForm from './LambdaForm';
import LambdaStats from '../components/LambdaStats';
import validate from '../validations';
import { generatePatches } from '../payloadTransformer';
import { getEditLambdaModel } from '../reducers/selectors';
import withLambdaState from '../hocs/withLambdaState';
import withLambda from '../hocs/withLambda';
import runTimes from '../lists/runTimes';
import withAPIEndpoints from '../../APIEndpoints/hocs/withAPIEndpoints';
import iconMap from '../../Providers/config/iconMap';

const focusOnErrors = createDecorator();

class LambdaEdit extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    lambda: PropTypes.object.isRequired,
    lambdaActions: PropTypes.object.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    executors: PropTypes.array.isRequired,
    secrets: PropTypes.array.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    lambdaStateActions: PropTypes.object.isRequired,
    selectedRuntime: PropTypes.object.isRequired,
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

    lambdaActions.initLambdaEdit({ lambdaId: match.params.lambdaId });
    // TODO: Move to initLambdaEdit sagaworkflow
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
    const {
      match,
      lambda,
      lambdaPending,
      initialFormValues,
      apiEndpoints,
      apiEndpointsPending,
      lambdaStateActions,
      selectedRuntime,
    } = this.props;

    if (lambdaPending && !lambda.id) {
      return <ActivityContainer id="lambda-load" />;
    }

    const icon = selectedRuntime.value ? iconMap(selectedRuntime.value) : null;

    return (
      <Row center>
        <Col flex={10} xs={12} sm={12} md={10}>
          <ActionsToolbar
            title={lambda.name}
            titleIcon={icon}
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/lambdas`}
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

              <FinalForm
                editMode
                keepDirtyOnReinitialize
                onSubmit={this.update}
                initialValues={initialFormValues}
                initialValuesEqual={isEqual} // keeps array fields from re-rendering
                validate={validate}
                mutators={{ ...arrayMutators }}
                decorators={[focusOnErrors]}
                onSaveInlineCode={this.handleSaveInlineCode}
                render={({ handleSubmit, values, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    disabled={lambdaPending}
                    disabledSubmit={submitting || !values.properties.runtime || !values.properties.provider.id}
                    submitTitle="Update"
                  >
                    <LambdaForm values={values} {...rest} />
                  </Form>
                )}
                {...this.props}
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
            </Tab>

            <Tab title="Statistics">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <LambdaStats
                      fqon={match.params.fqon}
                      providerId={lambda.properties.provider.id}
                      lambdaId={lambda.id}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={lambda}
                      name={lambda.name}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getEditLambdaModel(state),
});

export default compose(
  withLambdaState,
  withLambda(),
  withAPIEndpoints(),
  withEntitlements,
  connect(mapStateToProps),
)(LambdaEdit);
