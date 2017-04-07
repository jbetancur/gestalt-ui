import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import { map } from 'lodash';
import { volumeModalActions } from 'modules/VolumeModal';
import { portmapModalActions } from 'modules/PortMappingModal';
import { healthCheckModalActions } from 'modules/HealthCheckModal';
import ContainerForm from '../../components/ContainerForm';
import validate from '../../validations';
import * as actions from '../../actions';

class ContainerEdit extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    fetchContainer: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadPortmappings: PropTypes.func.isRequired,
    updateContainer: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { params, fetchProvidersByType, fetchEnv } = this.props;
    const entityId = params.environmentId || params.workspaceId || null;
    const entityKey = params.workspaceId && params.environmentId ? 'environments' : 'workspaces';

    fetchProvidersByType(params.fqon, entityId, entityKey, 'CaaS');
    fetchEnv(params.fqon, entityId, entityKey);
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
    const { params, fetchContainer } = this.props;

    fetchContainer(params.fqon, params.containerId, params.environmentId, isPolling);
  }

  redeployContainer(values) {
    const { id } = this.props.container;
    const { params, router, updateContainer } = this.props;
    const onSuccess = () => router.goBack();

    updateContainer(params.fqon, params.environmentId, id, values, onSuccess);
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
})(ContainerEdit));
