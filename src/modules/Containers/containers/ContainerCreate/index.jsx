import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { cloneDeep, map } from 'lodash';
import { volumeModalActions } from 'modules/VolumeModal';
import { networkModalActions } from 'modules/NetworkModal';
import { healthCheckModalActions } from 'modules/HealthCheckModal';
import CircularActivity from 'components/CircularActivity';
import ContainerForm from '../../components/ContainerForm';
import validate from '../../validations';
import * as actions from '../../actions';

class ContainerCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createContainer: PropTypes.func.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadNetworks: PropTypes.func.isRequired,
    unloadHealthChecks: PropTypes.func.isRequired,
    volumes: PropTypes.array.isRequired,
    networks: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    pendingEnv: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentWillMount() {
    const { params, fetchEnv } = this.props;
    fetchEnv(params.fqon, params.environmentId);
  }

  componentWillUnmount() {
    const { onUnload, unloadVolumes, unloadNetworks, unloadHealthChecks } = this.props;
    onUnload();
    unloadVolumes();
    unloadNetworks();
    unloadHealthChecks();
  }

  create(values) {
    const { params, createContainer } = this.props;
    const payload = cloneDeep(values);

    delete payload.variables;

    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.name] = variable.value;
      });
    }

    delete payload.labels;

    if (values.labels) {
      values.labels.forEach((label) => {
        payload.properties.labels[label.name] = label.value;
      });
    }

    if (this.props.volumes) {
      payload.properties.volumes = this.props.volumes;
    }

    if (this.props.networks) {  // TODO: rename to portMappings
      payload.properties.port_mappings = this.props.networks;
    }

    if (this.props.healthChecks) {
      payload.properties.health_checks = this.props.healthChecks;
    }

    createContainer(params.fqon, params.workspaceId, params.environmentId, payload);
  }

  render() {
    return this.props.pendingEnv ? <CircularActivity id="container-load" /> : <ContainerForm inlineMode={this.props.inlineMode} title="Deploy Container" submitLabel="Deploy" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions, volumeModalActions, networkModalActions, healthCheckModalActions), dispatch);
}

function mapStateToProps(state) {
  const { container, pending } = state.containers.fetchOne;
  const variables = map(Object.assign({}, state.containers.env.env), (value, name) => ({ name, value }));

  return {
    container,
    pending,
    pendingEnv: state.containers.env.pending,
    pendingProviders: state.containers.providers.pending,
    providers: state.containers.providers.providers,
    volumeModal: state.volumeModal.volumeModal,
    volumes: state.volumeModal.volumes.volumes,
    networkModal: state.networkModal.networkModal,
    networks: state.networkModal.networks.networks,
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
        provider: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'containerCreate',
  validate
})(ContainerCreate));
