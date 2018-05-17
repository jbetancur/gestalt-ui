import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ContainerEdit, ContainerActions, containerActionCreators } from 'Modules/Containers';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Button } from 'components/Buttons';
import Div from 'components/Div';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import ActionsToolbar from 'components/ActionsToolbar';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPatches } from '../payloadTransformer';
import { getEditProviderModel } from '../selectors';
import { generateResourceTypeSchema } from '../lists/providerTypes';

class ProviderEdit extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    fetchProviderContainer: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    confirmUpdate: PropTypes.func.isRequired,
    redeployProvider: PropTypes.func.isRequired,
    unloadProvider: PropTypes.func.isRequired,
    containerValues: PropTypes.object,
    containerPending: PropTypes.bool.isRequired,
    resourcetypesLoading: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    resourcetypesData: PropTypes.array.isRequired,
  };

  static defaultProps = {
    containerValues: {},
  };

  state = { redeploy: false };

  componentDidMount() {
    this.populateProvider();
    this.populateContainer();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.id !== this.props.provider.id) {
      if (nextProps.provider.properties.services && nextProps.provider.properties.services.length > 0) {
        clearTimeout(this.timeout);

        if (!nextProps.containerPending) {
          this.startPoll();
        }
      }
    }
  }

  componentDidCatch(error, info) {
    // TODO: Eat errors related to calling fetchEnvSchema and redux-form FieldArrays and don't unmount the form
    this.setState({ hasError: true, error, info });
  }

  componentWillUnmount() {
    const { unloadProvider } = this.props;

    unloadProvider();
    clearTimeout(this.timeout);
  }

  flagForRedeploy = () => {
    this.setState({ redeploy: true });
  }

  populateProvider() {
    const { match, fetchProvider } = this.props;

    fetchProvider(match.params.fqon, match.params.providerId);
  }

  populateContainer() {
    const { match, fetchProviderContainer } = this.props;

    fetchProviderContainer(match.params.fqon, match.params.providerId);
  }

  startPoll() {
    this.timeout = setInterval(() => this.populateContainer(true), 5000);
  }

  update = (formValues) => {
    const { match, confirmUpdate, provider, updateProvider, redeployProvider, containerValues } = this.props;

    if (this.state.redeploy) {
      const handleRedeploy = () => {
        redeployProvider(match.params.fqon, provider.id);
      };

      const onClose = this.setState({ redeploy: false });

      confirmUpdate(handleRedeploy, provider.name, onClose);
    } else {
      const patches = generateProviderPatches(provider, formValues, containerValues);

      updateProvider(match.params.fqon, provider.id, patches);
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

  showContainer(selectedProviderType) {
    return selectedProviderType.allowContainer &&
      this.props.provider.properties.services &&
      this.props.provider.properties.services.length > 0;
  }

  showEntitlements = () => {
    const { entitlementActions, provider, match } = this.props;

    entitlementActions.showEntitlementsModal(provider.name, match.params.fqon, provider.id, 'providers', 'Provider');
  }

  render() {
    const { provider, container, resourcetypesData, providerPending, resourcetypesLoading } = this.props;
    const compiledProviderTypes = generateResourceTypeSchema(resourcetypesData);
    const selectedProviderType = compiledProviderTypes.find(type => type.name === provider.resource_type) || {};
    const showContainer = selectedProviderType.allowContainer;

    return (
      (providerPending || resourcetypesLoading) ?
        <ActivityContainer id="provider-loading" /> :
        <Row center gutter={5}>
          <Col flex={10} xs={12} sm={12} md={12}>
            <ActionsToolbar
              title={provider.name}
              subtitle={selectedProviderType.displayName}
              actions={[
                <Button
                  key="provider--entitlements"
                  flat
                  iconChildren="security"
                  onClick={this.showEntitlements}
                >
                  Entitlements
                </Button>,
                showContainer &&
                <ContainerActions
                  key="provider-container-actions"
                  inContainerView
                  containerModel={container}
                  disableDestroy
                  disablePromote
                />
              ]}
            />

            {providerPending && <ActivityContainer id="provider-form" />}

            <ProviderForm
              editMode
              showContainer={showContainer}
              onSubmit={this.update}
              onRedeploy={this.flagForRedeploy}
              goBack={this.goBack}
              selectedProviderType={selectedProviderType}
              {...this.props}
            />

            {showContainer &&
              <Row gutter={10} component={Div} pending={providerPending}>
                <Col flex={12}>
                  <Panel title="Container Specification" defaultExpanded={showContainer}>
                    <Caption light>{`The provider type ${selectedProviderType.displayName} requires a container`}</Caption>
                    <ContainerEdit containerSpec={provider.properties.services[0].container_spec} inlineMode />
                  </Panel>
                </Col>
              </Row>}

          </Col>
        </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    initialValues: getEditProviderModel(state),
    containerValues: getFormValues('containerEdit')(state),
  };
}

export default compose(
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false, params: { type: 'Gestalt::Configuration::Provider' } }),
  withPickerData({ entity: 'providers', label: 'Providers', params: { expand: false } }),
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions, containerActionCreators)),
  reduxForm({
    form: 'providerEdit',
    enableReinitialize: true,
    validate,
  })
)(ProviderEdit);
