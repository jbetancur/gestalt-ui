import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import { Tabs, Tab } from 'components/Tabs';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import { Card } from 'components/Cards';
import { FullPageFooter } from 'components/FullPage';
import { generateContextEntityState } from 'util/helpers/context';
import { getLastFromSplit } from 'util/helpers/strings';
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
  getEditContainerModelAsSpec,
  selectContainer,
  getContainerInstances,
} from '../selectors';
import ActionsModals from '../ActionModals';

class ContainerEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    fetchContainer: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
    updateContainer: PropTypes.func.isRequired,
    containerPending: PropTypes.bool.isRequired,
    unloadContainer: PropTypes.func.isRequired,
    inlineMode: PropTypes.bool,
    entitlementActions: PropTypes.object.isRequired,
    containerInstances: PropTypes.array.isRequired,
    fetchprovidersData: PropTypes.func.isRequired,
    providersData: PropTypes.array.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentDidMount() {
    const { match, fetchAPIEndpoints } = this.props;

    if (!this.props.inlineMode) {
      this.populateContainer();
      fetchAPIEndpoints(match.params.fqon, match.params.containerId, 'container');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.container !== nextProps.container) {
      clearTimeout(this.timeout);

      if (!nextProps.containerPending) {
        this.startPoll();
      }

      // stop polling if the container is destroyed
      if (!nextProps.container.id) {
        clearTimeout(this.timeout);
      }
    }
  }

  componentWillUnmount() {
    const { unloadContainer, unloadAPIEndpoints } = this.props;

    unloadContainer();
    unloadAPIEndpoints();
    clearTimeout(this.timeout);
  }

  startPoll() {
    this.timeout = setInterval(() => this.populateContainer(true), 5000);
  }

  populateContainer(isPolling) {
    const { match, fetchContainer } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchContainer(match.params.fqon, match.params.containerId, entity.id, entity.key, isPolling);
  }

  redeployContainer = (values) => {
    const { match, container, updateContainer, inlineMode } = this.props;

    if (!inlineMode) {
      const payload = generatePayload(values, true);

      updateContainer(match.params.fqon, container.id, payload);
    }
  }

  showEntitlements = () => {
    const { entitlementActions, container, match } = this.props;

    entitlementActions.showEntitlementsModal(container.name, match.params.fqon, container.id, 'containers', 'Container');
  }

  render() {
    const { match, container, containerPending, containerInstances, providersData, inlineMode } = this.props;
    // TODO: Implemented this way due to container provider missing properties.provider.resource_type
    const selectedProvider = providersData.find(p => p.id === container.properties.provider.id) || {};
    const providerType = getLastFromSplit(selectedProvider.resource_type);

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
              title={`${container.name}::${providerType}`}
              titleIcon={<ContainerIcon resourceType={providerType} />}
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
                        instances={containerInstances}
                        providerType={providerType}
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
                <Row gutter={5}>
                  <Col flex={12}>
                    <Panel title="Resource Details" defaultExpanded={false}>
                      <DetailsPane model={container} />
                    </Panel>
                  </Col>
                </Row>

                <ContainerForm
                  editMode
                  inlineMode={inlineMode}
                  onSubmit={this.redeployContainer}
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

const formName = 'containerEdit';
const mapStateToProps = (state, ownProps) => ({
  container: ownProps.containerSpec || selectContainer(state),
  containerInstances: getContainerInstances(state),
  initialValues: ownProps.containerSpec ? getEditContainerModelAsSpec(state, ownProps.containerSpec) : getEditContainerModel(state),
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withMetaResource,
  withEntitlements,
  withRouter,
  connect(mapStateToProps, actions),
  reduxForm({
    form: formName,
    enableReinitialize: true,
    validate,
  })
)(ContainerEdit);

