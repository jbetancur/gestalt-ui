import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'react-fast-compare';
import styled from 'styled-components';
import { IconSeparator, FontIcon } from 'react-md';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { Tabs, Tab } from 'components/Tabs';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Card } from 'components/Cards';
import { APIEndpointInlineList } from 'Modules/APIEndpoints';
import { Caption } from 'components/Typography';
import Div from 'components/Div';
import PayloadViewer from '../components/PayloadViewer';
import ContainerForm from './ContainerForm';
import ContainerActions from '../components/ContainerActions';
import ContainerInstances from '../components/ContainerInstances';
import ContainerEvents from '../components/ContainerEvents';
import ContainerServiceAddresses from '../components/ContainerServiceAddresses';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import {
  getEditContainerModel,
  selectProvider,
  selectVolumeListing,
} from '../selectors';
import ActionsModals from '../ActionModals';
import withAPIEndpoints from '../../APIEndpoints/hocs/withAPIEndpoints';
import withContainer from '../hocs/withContainer';
import iconMap from '../../Providers/config/iconMap';

const focusOnErrors = createDecorator();

const StatusDetails = styled(IconSeparator)`
  margin-right: 5px;
  padding: 3px;

  i {
    color: ${props => props.theme.colors['$md-blue-500']};
  }
`;

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
    initialFormValues: PropTypes.object.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    containerVolumes: PropTypes.array.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentDidMount() {
    const { match, apiEndpointsActions, containerActions } = this.props;

    if (!this.props.inlineMode) {
      // containerActions.fetchContainer({ fqon: match.params.fqon, containerId: match.params.containerId, enablePolling: true, });
      containerActions.initContainerEdit({ containerId: match.params.containerId, enablePolling: true });
      apiEndpointsActions.fetchAPIEndpoints({ fqon: match.params.fqon, params: { implementation_type: 'container', implementation_id: match.params.containerId } });
    }
  }

  redeployContainer = (values) => {
    const { match, container, containerActions, inlineMode, containerVolumes } = this.props;

    if (!inlineMode) {
      const payload = generatePayload(values, true, containerVolumes);

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

    if (containerPending && !container.id) {
      return <ActivityContainer id="container-loading" />;
    }

    const enabledEndpoints = !inlineMode && container.properties.port_mappings.length > 0;
    const statusDetail =
      container.properties.status_detail
      && container.properties.status_detail.reason
      && `${container.properties.status_detail.stateId}-${container.properties.status_detail.reason}`;

    return (
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
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
            titleIcon={iconMap(selectedProvider.type)}
            actions={[
              statusDetail &&
              <StatusDetails key="container--statusDetail" label={statusDetail} iconBefore>
                <FontIcon>info_outline</FontIcon>
              </StatusDetails>,
              !inlineMode &&
              <ContainerActions
                key="container--actions"
                inContainerView
                containerModel={container}
                disableDestroy={inlineMode}
                disablePromote={inlineMode}
              />,
              <Button
                key="container--entitlements"
                flat
                outline
                iconChildren="security"
                onClick={this.showEntitlements}
              >
                Entitlements
              </Button>,
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
                decorators={[focusOnErrors]}
                loading={containerPending}
                initialValues={initialFormValues}
                initialValuesEqual={isEqual} // keeps array fields from re-rendering
                validate={validate}
                inlineMode={inlineMode}
                keepDirtyOnReinitialize
                render={({ handleSubmit, submitting, ...rest }) => (
                  <Form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    disabled={containerPending}
                    disabledSubmit={containerPending || submitting || !selectedProvider.isSelected}
                    submitTitle="Update"
                  >
                    <ContainerForm {...rest} />
                  </Form>
                )}
                {...this.props}
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
            </Tab>

            {selectedProvider.supportsEvents ?
              <Tab title="Events">
                <Row gutter={5}>
                  <Col flex={12}>
                    <Card>
                      <ContainerEvents
                        events={container.properties.events}
                      />
                    </Card>
                  </Col>
                </Row>
              </Tab> : <div />}

            <Tab title="YAML/JSON">
              <Row gutter={5}>
                <Col flex={12}>
                  <Card>
                    <PayloadViewer
                      value={container}
                      name={container.name}
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
  initialFormValues: getEditContainerModel(state),
  selectedProvider: selectProvider(state),
  containerVolumes: selectVolumeListing(state),
});

export default compose(
  withContainer(),
  withAPIEndpoints(),
  withEntitlements,
  withRouter,
  connect(mapStateToProps, actions),
)(ContainerEdit);
