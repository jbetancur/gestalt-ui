import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { withRouter, Link } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import arrayMutators from 'final-form-arrays';
import { withContainer, withAPIEndpoints } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { Tabs, Tab } from 'components/Tabs';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Card } from 'components/Cards';
import { FullPageFooter } from 'components/FullPage';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import { Caption } from 'components/Typography';
import Div from 'components/Div';
import ContainerForm from './ContainerForm';
import ContainerActions from '../components/ContainerActions';
import ContainerIcon from '../components/ContainerIcon';
import ContainerInstances from '../components/ContainerInstances';
import ContainerServiceAddresses from '../components/ContainerServiceAddresses';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import {
  getEditContainerModel,
  selectContainer,
  selectProvider,
} from '../selectors';
import ActionsModals from '../ActionModals';

class ContainerEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    showAPIEndpointWizardModal: PropTypes.func.isRequired,
    containerActions: PropTypes.object.isRequired,
    containerPending: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool,
    entitlementActions: PropTypes.object.isRequired,
    containerInstances: PropTypes.array.isRequired,
    containerServiceAddresses: PropTypes.array.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    setSelectedProvider: PropTypes.func.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentDidMount() {
    const { match, apiEndpointsActions, containerActions, container, setSelectedProvider } = this.props;

    setSelectedProvider(container.properties.provider);
    if (!this.props.inlineMode) {
      containerActions.fetchContainer({ fqon: match.params.fqon, containerId: match.params.containerId, enablePolling: true, });
      apiEndpointsActions.fetchAPIEndpoints({ fqon: match.params.fqon, params: { implementation_type: 'container', implementation_id: match.params.containerId } });
    }
  }

  componentDidUpdate(prevProps) {
    // only update chart if the data has changed
    const { container, setSelectedProvider } = this.props;

    if (prevProps.container.id !== container.id) {
      setSelectedProvider(container.properties.provider);
    }
  }

  redeployContainer = (values) => {
    const { match, container, containerActions, inlineMode } = this.props;

    if (!inlineMode) {
      const payload = generatePayload(values, true);

      containerActions.updateContainer({ fqon: match.params.fqon, containerId: container.id, payload });
    }
  }

  showEntitlements = () => {
    const { entitlementActions, container, match } = this.props;

    entitlementActions.showEntitlementsModal(container.name, match.params.fqon, container.id, 'containers', 'Container');
  }

  render() {
    const {
      match,
      container,
      containerPending,
      inlineMode,
      initialFormValues,
      selectedProvider,
      apiEndpoints,
      apiEndpointsPending,
      showAPIEndpointWizardModal,
    } = this.props;

    const enabledEndpoints = !inlineMode && container.properties.port_mappings.length > 0;

    return (
      containerPending && !container.id ?
        <ActivityContainer id="container-loading" /> :
        <Row gutter={5} center>
          <Col
            flex={inlineMode ? 12 : 10}
            xs={12}
            sm={12}
            md={12}
          >
            <ActionsModals />
            <ActionsToolbar
              title={container.name}
              subtitle={selectedProvider.name}
              titleIcon={<ContainerIcon resourceType={selectedProvider.type} />}
              actions={[
                !inlineMode &&
                <Button
                  key="container--entitlements"
                  flat
                  iconChildren="security"
                  onClick={this.showEntitlements}
                >
                  Entitlements
                </Button>,
                <ContainerActions
                  key="container--actions"
                  inContainerView
                  containerModel={container}
                  disableDestroy={inlineMode}
                  disablePromote={inlineMode}
                />,
              ]}
            />

            {containerPending && <ActivityContainer id="container-form-loading" />}

            <Tabs>
              <Tab title="Instances">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <ContainerInstances
                        providerType={selectedProvider.type}
                        containerModel={container}
                        fqon={match.params.fqon}
                      />
                    </Card>
                  </Col>
                </Row>

                {!inlineMode &&
                  <FullPageFooter>
                    <Button
                      flat
                      iconChildren="arrow_back"
                      component={Link}
                      to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
                    >
                      Containers
                    </Button>
                  </FullPageFooter>}
              </Tab>

              <Tab title={inlineMode ? 'Container Spec' : 'Container'}>
                {!inlineMode &&
                <Row gutter={5}>
                  <Col flex={12}>
                    <Panel title="Resource Details" defaultExpanded={false}>
                      <DetailsPane model={container} />
                    </Panel>
                  </Col>
                </Row>}

                {!inlineMode &&
                  <Row gutter={5}>
                    <Col flex={12}>
                      <Panel
                        title="Public Endpoints"
                        pending={apiEndpointsPending && !apiEndpoints.length}
                        noPadding
                        count={apiEndpoints.length}
                      >
                        {!enabledEndpoints &&
                          <Div padding="16px">
                            <Caption>Update this container with a Service Mapping to add a Public Endpoint</Caption>
                          </Div>}

                        <APIEndpointInlineList
                          endpoints={apiEndpoints}
                          onAddEndpoint={() => showAPIEndpointWizardModal(match.params, container.id, 'container', container.properties.port_mappings)}
                          disabled={!enabledEndpoints}
                        />
                      </Panel>
                    </Col>
                  </Row>}

                <FinalForm
                  editMode
                  onSubmit={this.redeployContainer}
                  mutators={{ ...arrayMutators }}
                  loading={containerPending}
                  initialValues={initialFormValues}
                  validate={validate}
                  inlineMode={inlineMode}
                  keepDirtyOnReinitialize
                  render={({ handleSubmit, ...rest }) => (
                    <Form onSubmit={handleSubmit} autoComplete="off" disabled={containerPending}>
                      <ContainerForm {...rest} />
                    </Form>
                  )}
                />
              </Tab>

              <Tab title="Service Addresses">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <ContainerServiceAddresses
                        portMappings={container.properties.port_mappings}
                      />
                    </Card>
                  </Col>
                </Row>

                {!inlineMode &&
                  <FullPageFooter>
                    <Button
                      flat
                      iconChildren="arrow_back"
                      component={Link}
                      to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
                    >
                      Containers
                    </Button>
                  </FullPageFooter>}
              </Tab>
            </Tabs>
          </Col>
        </Row>
    );
  }
}

const mapStateToProps = state => ({
  container: selectContainer(state),
  initialFormValues: getEditContainerModel(state),
  selectedProvider: selectProvider(state),
});

export default compose(
  withContainer(),
  withAPIEndpoints(),
  withEntitlements,
  withRouter,
  connect(mapStateToProps, actions),
)(ContainerEdit);
