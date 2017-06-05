import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import { map } from 'lodash';
import { volumeModalActions } from 'modules/VolumeModal';
import { portmapModalActions } from 'modules/PortMappingModal';
import { healthCheckModalActions } from 'modules/HealthCheckModal';
import CircularActivity from 'components/CircularActivity';
import ContainerForm from '../../components/ContainerForm';
import validate from '../../validations';
import * as actions from '../../actions';
import { generateContainerPayload } from '../../payloadTransformers';

class ContainerCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createContainer: PropTypes.func.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadPortmappings: PropTypes.func.isRequired,
    unloadHealthChecks: PropTypes.func.isRequired,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    pendingEnv: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentDidMount() {
    const { params, fetchEnv } = this.props;
    const entityId = params.environmentId || params.workspaceId || null;
    const entityKey = params.workspaceId && params.environmentId ? 'environments' : 'workspaces';

    fetchEnv(params.fqon, entityId, entityKey);
  }

  componentWillUnmount() {
    const { unloadVolumes, unloadPortmappings, unloadHealthChecks } = this.props;
    unloadVolumes();
    unloadPortmappings();
    unloadHealthChecks();
  }

  create(values) {
    const { params, router, createContainer, volumes, portMappings, healthChecks } = this.props;
    const payload = generateContainerPayload(values, volumes, portMappings, healthChecks);
    const onSuccess = () => router.goBack();

    createContainer(params.fqon, params.environmentId, payload, onSuccess);
  }

  render() {
    return this.props.pendingEnv ? <CircularActivity id="container-load" /> : <ContainerForm inlineMode={this.props.inlineMode} title="Deploy Container" submitLabel="Deploy" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { container, pending } = state.metaResource.container;
  const variables = map(Object.assign({}, state.metaResource.env.env), (value, name) => ({ name, value }));

  return {
    container,
    pending,
    pendingEnv: state.metaResource.env.pending,
    pendingProviders: state.metaResource.providersByType.pending,
    providers: state.metaResource.providersByType.providers,
    volumeModal: state.volumeModal.volumeModal,
    volumes: state.volumeModal.volumes.volumes,
    portmapModal: state.portmapModal.portmapModal,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthCheckModal: state.healthCheckModal.healthCheckModal,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
    initialValues: {
      name: '',
      properties: {
        container_type: 'DOCKER',
        env: {},
        labels: {},
        accepted_resource_roles: [],
        constraints: [],
        health_checks: [],
        instances: [],
        port_mappings: [],
        service_addresses: [],
        volumes: [],
        provider: {
          locations: [],
        },
        force_pull: false,
        cpus: 0.1,
        memory: 128,
        num_instances: 1,
      },
      variables,
    },
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps,
Object.assign({}, actions, metaActions, volumeModalActions, portmapModalActions, healthCheckModalActions))(reduxForm({
  form: 'containerCreate',
  validate
})(ContainerCreate));

