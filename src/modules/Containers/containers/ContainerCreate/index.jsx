import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withContext, Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { volumeModalActions } from 'modules/VolumeModal';
import { portmapModalActions } from 'modules/PortMappingModal';
import { healthCheckModalActions } from 'modules/HealthCheckModal';
import { secretModalActions } from 'modules/Secrets';
import ActivityContainer from 'components/ActivityContainer';
import ContainerForm from '../../components/ContainerForm';
import validate from '../../validations';
import actions from '../../actions';
import { generateContainerPayload } from '../../payloadTransformer';

class ContainerCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createContainer: PropTypes.func.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadSecretsModal: PropTypes.func.isRequired,
    unloadPortmappings: PropTypes.func.isRequired,
    unloadHealthChecks: PropTypes.func.isRequired,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    secretsFromModal: PropTypes.array.isRequired,
    envPending: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
    history: {},
  };

  componentDidMount() {
    const { match, fetchEnv } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

    fetchEnv(match.params.fqon, entityId, entityKey);
  }

  componentWillUnmount() {
    const { unloadVolumes, unloadPortmappings, unloadHealthChecks, unloadSecretsModal } = this.props;
    unloadVolumes();
    unloadSecretsModal();
    unloadPortmappings();
    unloadHealthChecks();
  }

  create(values) {
    const { match, history, createContainer, volumes, portMappings, healthChecks, secretsFromModal } = this.props;
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

    const payload = generateContainerPayload(values, mergeProps);
    const onSuccess = () => history.goBack();

    createContainer(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return (
      <div>
        {!this.props.inlineMode &&
          <ContextNavigation
            breadcrumbComponent={<Breadcrumbs />}
          />}
        {this.props.envPending ?
          <ActivityContainer id="container-load" /> :
          <ContainerForm
            inlineMode={this.props.inlineMode}
            title="Deploy Container"
            submitLabel="Deploy"
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.create(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    volumeModal: state.volumeModal.volumeModal,
    volumes: state.volumeModal.volumes.volumes,
    portmapModal: state.portmapModal.portmapModal,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthCheckModal: state.healthCheckModal.healthCheckModal,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
    secretsFromModal: state.secrets.secrets.secrets,
    secretPanelModal: state.secrets.secretPanelModal,
    initialValues: {
      name: '',
      properties: {
        container_type: 'DOCKER',
        env: mapTo2DArray(state.metaResource.env.env, 'name', 'value', { inherited: true }),
        labels: [],
        accepted_resource_roles: [],
        constraints: [],
        health_checks: [],
        instances: [],
        port_mappings: [],
        volumes: [],
        secrets: [],
        provider: {
          locations: [],
        },
        force_pull: false,
        cpus: 0.1,
        memory: 128,
        num_instances: 1,
      },
    },
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps,
  Object.assign({}, actions, volumeModalActions, portmapModalActions, healthCheckModalActions, secretModalActions))(reduxForm({
  form: 'containerCreate',
  validate,
})(withContext(ContainerCreate))));

