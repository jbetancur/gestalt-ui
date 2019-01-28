import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { Col, Row } from 'react-flexybox';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { withEntitlements } from 'Modules/Entitlements';
import { ContainerActions, ContainerActionsModal, ContainerInstances, ContainerServiceAddresses } from 'Modules/Containers';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Button } from 'components/Buttons';
import ActionsToolbar from 'components/ActionsToolbar';
import { Tabs, Tab } from 'components/Tabs';
import { Card, CardTitle } from 'components/Cards';
import PayloadViewer from '../components/PayloadViewer';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPatches } from '../payloadTransformer';
import { getEditProviderModel, getProviderContainer } from '../reducers/selectors';
import withProvider from '../hocs/withProvider';

const focusOnErrors = createDecorator();

class ProviderEdit extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    providerActions: PropTypes.object.isRequired,
    confirmUpdate: PropTypes.func.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    selectedProviderType: PropTypes.object.isRequired,
    hasContainer: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, providerActions } = this.props;

    providerActions.initProviderEdit({ providerId: match.params.providerId });
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  populateProvider() {
    const { match, providerActions } = this.props;

    providerActions.fetchProvider({ fqon: match.params.fqon, id: match.params.providerId });
  }

  handleRedeploy = () => {
    const { match, confirmUpdate, provider, providerActions } = this.props;
    const redeploy = () => providerActions.redeployProvider({ fqon: match.params.fqon, id: provider.id });

    confirmUpdate(redeploy, provider.name);
  }

  update = (formValues) => {
    const { match, provider, providerActions } = this.props;
    const payload = generateProviderPatches(provider, formValues);

    providerActions.updateProvider({ fqon: match.params.fqon, id: provider.id, payload });
  }

  generateBackLink() {
    const { match } = this.props;

    if (match.params.workspaceId && !match.params.environmentId) {
      return `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`;
    }

    if (match.params.workspaceId && match.params.environmentId) {
      return `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`;
    }

    return `/${match.params.fqon}/providers`;
  }

  showEntitlements = () => {
    const { entitlementActions, provider, match } = this.props;

    entitlementActions.showEntitlementsModal(provider.name, match.params.fqon, provider.id, 'providers', 'Provider');
  }

  render() {
    const {
      match,
      initialValues,
      provider,
      container,
      hasContainer,
      providerPending
    } = this.props;

    if (providerPending && !provider.id) {
      return <ActivityContainer id="provider-loading" />;
    }

    return (
      <Row center gutter={5}>
        <ContainerActionsModal />
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={provider.name}
            showBackNav
            sticky
            navTo={this.generateBackLink()}
            actions={[
              hasContainer &&
              <ContainerActions
                key="provider-container-actions"
                inContainerView
                containerModel={container}
                disableDestroy
                disablePromote
              />,
              hasContainer &&
              <Button
                key="provider-container-redeploy"
                flat
                iconChildren="launch"
                type="submit"
                onClick={this.handleRedeploy}
                disabled={providerPending}
                primary
              >
                Redeploy Container
              </Button>,
              <Button
                key="provider--entitlements"
                flat
                iconChildren="security"
                onClick={this.showEntitlements}
              >
                Entitlements
              </Button>,
            ]}
          />

          {providerPending && <ActivityContainer id="provider-form" />}

          <Tabs>
            <Tab title="Configuration">
              <Row gutter={5}>
                <Col flex={12}>
                  <Panel title="Resource Details" defaultExpanded={false}>
                    <DetailsPane model={provider} />
                  </Panel>
                </Col>
              </Row>

              <FinalForm
                initialValue={initialValues}
                validate={validate(hasContainer)}
                mutators={{ ...arrayMutators }}
                decorators={[focusOnErrors]}
                editMode
                onSubmit={this.update}
                subscription={{ submitting: true, pristine: true }}
                render={({ handleSubmit, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    disabled={providerPending}
                    autoComplete="off"
                    submitTitle="Update"
                    disabledSubmit={providerPending || submitting}
                  >
                    <ProviderForm {...rest} />
                  </Form>
                )}
                {...this.props}
              />
            </Tab>

            {hasContainer ?
              <Tab title="Service Instance">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <CardTitle title="Instances" />
                      <ContainerInstances
                        containerModel={container}
                        fqon={match.params.fqon}
                      />
                    </Card>
                  </Col>
                </Row>

                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <CardTitle title="Service Addresses" />
                      <ContainerServiceAddresses
                        portMappings={container.properties.port_mappings}
                      />
                    </Card>
                  </Col>
                </Row>
              </Tab> : <div />
            }

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={provider}
                      name={provider.name}
                      hasContainer={hasContainer}
                    />
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* <Tab title="Environment">
              <EnvironmentListing {...this.props} />
            </Tab> */}
          </Tabs>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getEditProviderModel(state),
  providerContainer: getProviderContainer(state),
});

export default compose(
  withProvider(),
  withEntitlements,
  connect(mapStateToProps, actions),
)(ProviderEdit);
