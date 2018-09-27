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
import { withProvider, withContainer, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ContainerActions, ContainerActionsModal, ContainerInstances, ContainerServiceAddresses, containerActionCreators } from 'Modules/Containers';
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
import { generateResourceTypeSchema } from '../lists/providerTypes';

const focusOnErrors = createDecorator();

class ProviderEdit extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    provider: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    providerContainer: PropTypes.object.isRequired,
    providerActions: PropTypes.object.isRequired,
    containerActions: PropTypes.object.isRequired,
    confirmUpdate: PropTypes.func.isRequired,
    resourcetypesLoading: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    resourcetypesData: PropTypes.array.isRequired,
    setSelectedProvider: PropTypes.func.isRequired,
    caasProvidersData: PropTypes.array.isRequired,
  };

  state = { redeploy: false };

  componentDidMount() {
    const { match, containerActions } = this.props;

    containerActions.fetchProviderContainer({
      fqon: match.params.fqon, providerId: match.params.providerId, params: { embed: 'provider' }, providerContainer: true, enablePolling: true
    });
    this.populateProvider();
  }

  componentDidUpdate(prevProps) {
    // only update chart if the data has changed
    const { provider, providerContainer, setSelectedProvider, caasProvidersData } = this.props;
    // make sure provider is loaded as well as provider data.
    // Since we cannot embed = provider we need to find in a list of queried providers by type
    if (prevProps.provider.id !== provider.id || prevProps.caasProvidersData !== caasProvidersData) {
      if (caasProvidersData.length && provider.id) {
        const selectedProvider = caasProvidersData.find(cp => providerContainer.properties.provider.id === cp.id);
        setSelectedProvider(selectedProvider);
      }
    }
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
    const { match, initialValues, provider, container, resourcetypesData, providerPending, resourcetypesLoading } = this.props;
    const compiledProviderTypes = generateResourceTypeSchema(resourcetypesData);
    const selectedProviderType = compiledProviderTypes.find(type => type.name === provider.resource_type) || {};

    return (
      (providerPending || resourcetypesLoading) ?
        <ActivityContainer id="provider-loading" /> :
        <Row center gutter={5}>
          <ContainerActionsModal />
          <Col flex={10} xs={12} sm={12} md={12}>
            <ActionsToolbar
              title={provider.name}
              subtitle={`Provider Type: ${selectedProviderType.displayName}`}
              actions={[
                selectedProviderType.allowContainer &&
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
                  validate={validate(selectedProviderType.allowContainer)}
                  mutators={{ ...arrayMutators }}
                  decorators={[focusOnErrors]}
                  editMode
                  onSubmit={this.update}
                  onRedeploy={this.flagForRedeploy}
                  goBack={this.goBack}
                  selectedProviderType={selectedProviderType}
                  // subscription={{ submitting: true, pristine: true }}
                  {...this.props}
                />
              </Tab>

              {selectedProviderType.allowContainer ?
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
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false, params: { type: 'Gestalt::Configuration::Provider' } }),
  withPickerData({ entity: 'providers', label: 'Providers', params: { expand: false } }),
  withPickerData({ entity: 'providers', alias: 'caasProviders', label: 'Providers', params: { type: 'CaaS' } }),
  withContainer(),
  withProvider(),
  withEntitlements,
  connect(mapStateToProps, { ...actions, ...containerActionCreators }),
)(ProviderEdit);
