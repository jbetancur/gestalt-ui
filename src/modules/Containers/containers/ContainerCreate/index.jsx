import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { map } from 'lodash';
import { volumeModalActions } from 'modules/VolumeModal';
import { portmapModalActions } from 'modules/PortMappingModal';
import { healthCheckModalActions } from 'modules/HealthCheckModal';
import ActivityContainer from 'components/ActivityContainer';
import ContainerForm from '../../components/ContainerForm';
import validate from '../../validations';
import actions from '../../actions';
import { generateContainerPayload } from '../../payloadTransformers';

class ContainerCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createContainer: PropTypes.func.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadPortmappings: PropTypes.func.isRequired,
    unloadHealthChecks: PropTypes.func.isRequired,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    envPending: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentDidMount() {
    const { match, fetchEnv } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

    fetchEnv(match.params.fqon, entityId, entityKey);
  }

  componentWillUnmount() {
    const { unloadVolumes, unloadPortmappings, unloadHealthChecks } = this.props;
    unloadVolumes();
    unloadPortmappings();
    unloadHealthChecks();
  }

  create(values) {
    const { match, history, createContainer, volumes, portMappings, healthChecks } = this.props;
    const payload = generateContainerPayload(values, volumes, portMappings, healthChecks);
    const onSuccess = () => history.goBack();

    createContainer(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return this.props.envPending ? <ActivityContainer id="container-load" /> :
    <ContainerForm
      inlineMode={this.props.inlineMode}
      title="Deploy Container"
      submitLabel="Deploy"
      cancelLabel="Back"
      onSubmit={values =>
      this.create(values)}
      {...this.props}
    />;
  }
}

function mapStateToProps(state) {
  const variables = map(Object.assign({}, state.metaResource.env.env), (value, name) => ({ name, value }));

  return {
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

export default withMetaResource(connect(mapStateToProps,
Object.assign({}, actions, volumeModalActions, portmapModalActions, healthCheckModalActions))(reduxForm({
  form: 'containerCreate',
  validate
})(withContext(ContainerCreate))));

