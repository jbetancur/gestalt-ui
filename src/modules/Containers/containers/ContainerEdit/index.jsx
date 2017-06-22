import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import { map } from 'lodash';
import { volumeModalActions } from 'modules/VolumeModal';
import { portmapModalActions } from 'modules/PortMappingModal';
import { healthCheckModalActions } from 'modules/HealthCheckModal';
import ContainerForm from '../../components/ContainerForm';
import validate from '../../validations';
import actions from '../../actions';
import { generateContainerPayload } from '../../payloadTransformers';

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
    pending: PropTypes.bool.isRequired,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const { match, fetchProvidersByType, fetchEnv } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

    fetchProvidersByType(match.params.fqon, entityId, entityKey, 'CaaS');
    fetchEnv(match.params.fqon, entityId, entityKey);
    this.populateContainer();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.container !== nextProps.container) {
      clearTimeout(this.timeout);

      if (!nextProps.pending) {
        this.isPolling = false;
        this.startPoll();
      }
    }
  }

  componentWillUnmount() {
    const { unloadVolumes, unloadPortmappings } = this.props;
    unloadVolumes();
    unloadPortmappings();
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
    const { match, history, container, updateContainer, volumes, portMappings, healthChecks } = this.props;
    const payload = generateContainerPayload(values, volumes, portMappings, healthChecks, true);
    const onSuccess = () => history.goBack();
    clearTimeout(this.timeout);

    updateContainer(match.params.fqon, container.id, payload, onSuccess);
  }

  render() {
    const { container, pending } = this.props;
    return pending ? <CircularActivity id="container-load" /> :
    <ContainerForm
      editMode
      title={container.name}
      submitLabel="Redeploy"
      cancelLabel="Back"
      onSubmit={values => this.redeployContainer(values)}
      {...this.props}
    />;
  }
}

function mapStateToProps(state) {
  const { container, pending } = state.metaResource.container;
  const variables = map(container.properties.env, (value, name) => ({ name, value }));
  const labels = map(container.properties.labels, (value, name) => ({ name, value }));

  const model = {
    name: container.name,
    description: container.description,
    properties: {
      env: container.properties.env,
      labels: container.properties.labels,
      container_type: container.properties.container_type,
      accepted_resource_roles: container.properties.accepted_resource_roles,
      constraints: container.properties.constraints,
      health_checks: container.properties.health_checks,
      instances: container.properties.instances,
      port_mappings: container.properties.port_mappings,
      service_addresses: container.properties.service_addresses,
      volumes: container.properties.volumes,
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
    variables,
    labels,
  };

  return {
    container,
    pending,
    pendingProviders: state.metaResource.providersByType.pending,
    pendingContainerUpdate: state.metaResource.containerUpdate.pending,
    providers: state.metaResource.providersByType.providers,
    volumeModal: state.volumeModal.volumeModal,
    volumes: state.volumeModal.volumes.volumes,
    portmapModal: state.portmapModal.portmapModal,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthCheckModal: state.healthCheckModal.healthCheckModal,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps,
Object.assign({}, actions, metaActions, volumeModalActions, portmapModalActions, healthCheckModalActions))(reduxForm({
  form: 'containerEdit',
  validate
})(context(ContainerEdit)));
