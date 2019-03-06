import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'react-fast-compare';
import { parse } from 'query-string';
import styled from 'styled-components';
import { IconSeparator } from 'react-md';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'react-flexybox';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { Tabs, Tab } from 'components/Tabs';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Card } from 'components/Cards';
import { APIEndpointInlineList, APIEndpointWizardModal } from 'Modules/APIEndpoints';
import { Caption } from 'components/Typography';
import Div from 'components/Div';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import PayloadViewer from './PayloadViewer';
import ContainerForm from './ContainerForm';
import ContainerActions from './ContainerActions';
import ContainerInstances from './ContainerInstances';
import ContainerEvents from './ContainerEvents';
import ContainerServiceAddresses from './ContainerServiceAddresses';
import validate from '../validations';
import actions from '../actions';
import {
  getEditContainerModel,
  selectProvider,
  selectVolumeListing,
} from '../reducers/selectors';
import withAPIEndpoints from '../../APIEndpoints/hocs/withAPIEndpoints';
import withContainer from '../hocs/withContainer';
import iconMap from '../../Providers/config/iconMap';
import containerModel from '../models/container';

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
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    containerActions: PropTypes.object.isRequired,
    containerPending: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool,
    initialFormValues: PropTypes.object.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    containerVolumes: PropTypes.array.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  static contextType = ModalConsumer;

  constructor(props) {
    super(props);

    const query = parse(props.location.search);
    // use query parms to determined isJob.
    this.isJob = query.isJob === 'true';
  }

  componentDidMount() {
    const { match, apiEndpointsActions, containerActions } = this.props;

    if (!this.props.inlineMode) {
      containerActions.initContainerEdit({ containerId: match.params.containerId, enablePolling: true, isJob: this.isJob });
      if (!this.isJob) {
        apiEndpointsActions.fetchAPIEndpoints({ fqon: match.params.fqon, params: { implementation_type: 'container', implementation_id: match.params.containerId } });
      }
    }
  }

  redeployContainer = (values) => {
    const { match, container, containerActions, inlineMode, containerVolumes } = this.props;

    if (!inlineMode) {
      const payload = containerModel.put(values, containerVolumes);

      containerActions.updateContainer({ fqon: match.params.fqon, containerId: container.id, payload });
    }
  }

  showEntitlements = () => {
    const { container } = this.props;
    const { showModal } = this.context;

    showModal(EntitlementModal, {
      title: `Entitlements for "${container.name}" Container`,
      fqon: container.org.properties.fqon,
      entityId: container.id,
      entityKey: 'containers',
    });
  }

  showEndpointWizard = () => {
    const { container, match } = this.props;
    const { showModal } = this.context;

    showModal(APIEndpointWizardModal, {
      fqon: container.org.properties.fqon,
      environmentId: container.properties.parent.id || match.params.environmentId,
      implementationId: container.id,
      implementationType: 'container',
      portMappings: container.properties.port_mappings,
    });
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
    } = this.props;

    if (containerPending && !container.id) {
      return <ActivityContainer id="container-loading" />;
    }

    const enabledEndpoints = !inlineMode && container.properties.port_mappings.length > 0;
    const statusDetail =
      container.properties.status_detail
      && container.properties.status_detail.reason
      && `${container.properties.status_detail.stateId}-${container.properties.status_detail.reason}`;

    const title = this.isJob ? `${container.name} (Read Only)` : container.name;

    return (
      <Row gutter={5} center>
        <Col
          flex={inlineMode ? 12 : 10}
          xs={12}
          sm={12}
          md={12}
        >
          <ActionsToolbar
            title={title}
            showBackNav
            navTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers`}
            titleIcon={iconMap(selectedProvider.type)}
            sticky
            actions={[
              statusDetail &&
              <StatusDetails key="container--statusDetail" label={statusDetail} iconBefore>
                <InfoIcon fontSize="small" color="primary" />
              </StatusDetails>,
              !inlineMode &&
              <ContainerActions
                key="container--actions"
                inContainerView
                containerModel={container}
                disableDestroy={inlineMode}
                disablePromote={inlineMode || this.isJob}
                disableMigrate={this.isJob}
                disableScale={this.isJob}
                disableEntitlements={this.isJob}
              />,
              <Button
                key="container--entitlements"
                flat
                outline
                iconChildren="security"
                onClick={this.showEntitlements}
                disabled={this.isJob}
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

              {!inlineMode && !this.isJob &&
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
                        onAddEndpoint={this.showEndpointWizard}
                        disabled={!enabledEndpoints}
                      />
                    </Panel>
                  </Col>
                </Row>}

              <FinalForm
                editMode
                isJob={this.isJob}
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
                    disabledSubmit={containerPending || submitting || !selectedProvider.isSelected || this.isJob}
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
  withRouter,
  connect(mapStateToProps, actions),
)(ContainerEdit);
