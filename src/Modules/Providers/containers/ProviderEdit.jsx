import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
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
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPatches } from '../payloadTransformer';
import { getEditProviderModel, getProviderContainer } from '../selectors';
import withProvider from '../hocs/withProvider';

const focusOnErrors = createDecorator();

class ProviderEdit extends Component {
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

  state = { redeploy: false };

  componentDidMount() {
    const { match, providerActions } = this.props;

    providerActions.initProviderEdit({ providerId: match.params.providerId });
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  flagForRedeploy = () => {
    this.setState({ redeploy: true });
  }

  populateProvider() {
    const { match, providerActions } = this.props;

    providerActions.fetchProvider({ fqon: match.params.fqon, id: match.params.providerId });
  }

  update = (formValues) => {
    const { match, confirmUpdate, provider, providerActions } = this.props;

    if (this.state.redeploy) {
      const handleRedeploy = () => {
        providerActions.redeployProvider({ fqon: match.params.fqon, id: provider.id });
      };

      const onClose = this.setState({ redeploy: false });

      confirmUpdate(handleRedeploy, provider.name, onClose);
    } else {
      const payload = generateProviderPatches(provider, formValues);

      providerActions.updateProvider({ fqon: match.params.fqon, id: provider.id, payload });
    }
  }

  goBack = () => {
    const { match, history } = this.props;
    if (match.params.workspaceId && !match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`);
    } else if (match.params.workspaceId && match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`);
    } else {
      history.push(`/${match.params.fqon}/providers`);
    }
  };

  showEntitlements = () => {
    const { entitlementActions, provider, match } = this.props;

    entitlementActions.showEntitlementsModal(provider.name, match.params.fqon, provider.id, 'providers', 'Provider');
  }

  render() {
    const { match, initialValues, provider, container, selectedProviderType, hasContainer, providerPending } = this.props;

    return (
      (providerPending) ?
        <ActivityContainer id="provider-loading" /> :
        <Row center gutter={5}>
          <ContainerActionsModal />
          <Col flex={10} xs={12} sm={12} md={12}>
            <ActionsToolbar
              title={provider.name}
              subtitle={`Provider Type: ${selectedProviderType.displayName}`}
              actions={[
                hasContainer &&
                <ContainerActions
                  key="provider-container-actions"
                  inContainerView
                  containerModel={container}
                  disableDestroy
                  disablePromote
                />,
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

                <Form
                  component={ProviderForm}
                  initialValue={initialValues}
                  validate={validate(hasContainer)}
                  mutators={{ ...arrayMutators }}
                  decorators={[focusOnErrors]}
                  editMode
                  onSubmit={this.update}
                  onRedeploy={this.flagForRedeploy}
                  goBack={this.goBack}
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
