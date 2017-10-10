import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext, Breadcrumbs, ContextNavigation } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import { mapTo2DArray } from 'util/helpers/transformations';
import { volumeModalActions } from 'Modules/VolumeModal';
import { portmapModalActions } from 'Modules/PortMappingModal';
import { healthCheckModalActions } from 'Modules/HealthCheckModal';
import { secretModalActions } from 'Modules/Secrets';
import { parseChildClass } from 'util/helpers/strings';
import ContainerForm from '../components/ContainerForm';
import validate from '../validations';
import actions from '../actions';
import { generateContainerPayload } from '../payloadTransformer';

class ContainerEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    fetchContainer: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadPortmappings: PropTypes.func.isRequired,
    updateContainer: PropTypes.func.isRequired,
    containerPending: PropTypes.bool.isRequired,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    secrets: PropTypes.array.isRequired,
    pristine: PropTypes.bool.isRequired,
    fetchSecretsDropDown: PropTypes.func.isRequired,
    unloadSecretsModal: PropTypes.func.isRequired,
    secretsFromModal: PropTypes.array.isRequired,
    fetchActions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchProvidersByType, fetchEnv, fetchActions } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

    fetchProvidersByType(match.params.fqon, entityId, entityKey, 'CaaS');
    fetchEnv(match.params.fqon, entityId, entityKey);

    this.populateContainer();
    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'container.detail' });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.container !== nextProps.container) {
      clearTimeout(this.timeout);

      if (!nextProps.containerPending) {
        this.isPolling = false;
        this.startPoll();
      }

      // TODO: temporary until we support all providers
      if (!this.secretsPolled && parseChildClass(nextProps.container.properties.provider.resource_type) === 'Kubernetes') {
        this.secretsPolled = true;
        this.props.fetchSecretsDropDown(nextProps.match.params.fqon, nextProps.match.params.environmentId, nextProps.container.properties.provider.id);
      }
    }
  }

  componentWillUnmount() {
    const { unloadVolumes, unloadPortmappings, unloadSecretsModal } = this.props;
    unloadVolumes();
    unloadPortmappings();
    unloadSecretsModal();
    clearTimeout(this.timeout);
  }

  startPoll() {
    this.timeout = setTimeout(() => this.populateContainer(true), 5000);
  }

  populateContainer(isPolling) {
    const { match, fetchContainer } = this.props;

    fetchContainer(match.params.fqon, match.params.containerId, match.params.environmentId, isPolling);
  }

  redeployContainer(values) {
    const { match, history, container, updateContainer, volumes, portMappings, healthChecks, secretsFromModal } = this.props;
    const mergeProps = [
      {
        key: 'volumes',
        value: volumes,
      },
      {
        key: 'port_mappings',
        value: portMappings,
      },
      {
        key: 'health_checks',
        value: healthChecks,
      },
      {
        key: 'secrets',
        value: secretsFromModal,
      }
    ];

    const payload = generateContainerPayload(values, mergeProps, true);
    const onSuccess = () => history.goBack();
    clearTimeout(this.timeout);

    updateContainer(match.params.fqon, container.id, payload, onSuccess);
  }

  render() {
    const { container, containerPending } = this.props;

    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        {containerPending ?
          <ActivityContainer id="container-load" /> :
          <ContainerForm
            editMode
            title={container.name}
            submitLabel="Update"
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.redeployContainer(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { container } = state.metaResource.container;
  const model = {
    name: container.name,
    description: container.description,
    properties: {
      env: mapTo2DArray(container.properties.env),
      labels: mapTo2DArray(container.properties.labels),
      container_type: container.properties.container_type,
      accepted_resource_roles: container.properties.accepted_resource_roles,
      constraints: container.properties.constraints,
      health_checks: container.properties.health_checks,
      instances: container.properties.instances,
      port_mappings: container.properties.port_mappings,
      volumes: container.properties.volumes,
      secrets: container.properties.secrets || [],
      provider: container.properties.provider,
      force_pull: container.properties.force_pull,
      cpus: container.properties.cpus,
      memory: container.properties.memory,
      num_instances: container.properties.num_instances,
      network: container.properties.network,
      image: container.properties.image,
      cmd: container.properties.cmd,
      user: container.properties.user,
    },
  };

  return {
    container,
    volumeModal: state.volumeModal.volumeModal,
    volumes: state.volumeModal.volumes.volumes,
    portmapModal: state.portmapModal.portmapModal,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthCheckModal: state.healthCheckModal.healthCheckModal,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
    secretsFromModal: state.secrets.secrets.secrets,
    secretPanelModal: state.secrets.secretPanelModal,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps,
  Object.assign({}, actions, volumeModalActions, portmapModalActions, healthCheckModalActions, secretModalActions))(reduxForm({
  form: 'containerEdit',
  validate
})(withContext(ContainerEdit))));
