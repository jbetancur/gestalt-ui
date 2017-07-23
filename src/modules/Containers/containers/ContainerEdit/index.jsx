import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import { mapTo2DArray } from 'util/helpers/transformations';
import { volumeModalActions } from 'modules/VolumeModal';
import { portmapModalActions } from 'modules/PortMappingModal';
import { healthCheckModalActions } from 'modules/HealthCheckModal';
import ContainerForm from '../../components/ContainerForm';
import validate from '../../validations';
import actions from '../../actions';
import { generateContainerPayload } from '../../payloadTransformer';

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
    pristine: PropTypes.bool.isRequired,
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

      if (!nextProps.containerPending) {
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
      }
    ];

    const payload = generateContainerPayload(values, mergeProps, true);
    const onSuccess = () => history.goBack();
    clearTimeout(this.timeout);

    updateContainer(match.params.fqon, container.id, payload, onSuccess);
  }

  render() {
    const { container, containerPending } = this.props;
    return containerPending ? <ActivityContainer id="container-load" /> :
    <ContainerForm
      editMode
      title={container.name}
      submitLabel="Redeploy"
      cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
      onSubmit={values => this.redeployContainer(values)}
      {...this.props}
    />;
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
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps,
Object.assign({}, actions, volumeModalActions, portmapModalActions, healthCheckModalActions))(reduxForm({
  form: 'containerEdit',
  validate
})(withContext(ContainerEdit))));
