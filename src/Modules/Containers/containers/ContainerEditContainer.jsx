import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import { generateContextEntityState } from 'util/helpers/transformations';
import { volumeModalActions } from 'Modules/VolumeModal';
import { portmapModalActions } from 'Modules/PortMappingModal';
import { healthCheckModalActions } from 'Modules/HealthCheckModal';
import { secretModalActions } from 'Modules/Secrets';
import { parseChildClass } from 'util/helpers/strings';
import ContainerForm from '../components/ContainerForm';
import validate from '../validations';
import actions from '../actions';
import { generateContainerPayload } from '../payloadTransformer';
import { getEditContainerModel, selectContainer } from '../selectors';

class ContainerEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    fetchContainer: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadPortmappings: PropTypes.func.isRequired,
    updateContainer: PropTypes.func.isRequired,
    containerPending: PropTypes.bool.isRequired,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    secrets: PropTypes.array.isRequired,
    fetchSecretsDropDown: PropTypes.func.isRequired,
    unloadSecretsModal: PropTypes.func.isRequired,
    secretsFromModal: PropTypes.array.isRequired,
    fetchActions: PropTypes.func.isRequired,
    unloadContainer: PropTypes.func.isRequired,
    inlineMode: PropTypes.bool,
  };

  static defaultProps = {
    inlineMode: false,
  };

  componentDidMount() {
    const { match, fetchProvidersByType, fetchActions } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchProvidersByType(match.params.fqon, entity.id, entity.key, 'CaaS');

    if (!this.props.inlineMode) {
      this.populateContainer();
      fetchActions(match.params.fqon, entity.id, entity.key, { filter: 'container.detail' });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.container.id !== nextProps.container.id) {
      clearTimeout(this.timeout);

      if (!nextProps.containerPending) {
        this.startPoll();
      }

      // TODO: temporary until we support all providers
      if (!this.secretsPolled && parseChildClass(nextProps.container.properties.provider.resource_type) !== 'Docker') {
        this.secretsPolled = true;
        this.props.fetchSecretsDropDown(nextProps.match.params.fqon, nextProps.match.params.environmentId, nextProps.container.properties.provider.id);
      }
    }
  }

  componentWillUnmount() {
    const { unloadContainer, unloadVolumes, unloadPortmappings, unloadSecretsModal } = this.props;

    unloadContainer();
    unloadVolumes();
    unloadPortmappings();
    unloadSecretsModal();
    clearTimeout(this.timeout);
  }

  startPoll() {
    this.timeout = setInterval(() => this.populateContainer(true), 5000);
  }

  populateContainer(isPolling) {
    const { match, fetchContainer } = this.props;

    fetchContainer(match.params.fqon, match.params.containerId, match.params.environmentId, isPolling);
  }

  redeployContainer = (values) => {
    const { match, container, updateContainer, volumes, portMappings, healthChecks, secretsFromModal } = this.props;
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

    updateContainer(match.params.fqon, container.id, payload);
  }

  render() {
    const { container, containerPending } = this.props;

    return (
      <div>
        {containerPending && !container.id ?
          <ActivityContainer id="container-load" /> :
          <ContainerForm
            editMode
            inlineMode={this.props.inlineMode}
            title={container.name}
            submitLabel="Update"
            cancelLabel="Containers"
            onSubmit={this.redeployContainer}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    container: selectContainer(state),
    volumeModal: state.volumeModal.volumeModal,
    volumes: state.volumeModal.volumes.volumes,
    portmapModal: state.portmapModal.portmapModal,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthCheckModal: state.healthCheckModal.healthCheckModal,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
    secretsFromModal: state.secrets.secrets.secrets,
    secretPanelModal: state.secrets.secretPanelModal,
    initialValues: getEditContainerModel(state),
  };
}

export default compose(
  withMetaResource,
  withRouter,
  connect(mapStateToProps,
    Object.assign({}, actions, volumeModalActions, portmapModalActions, healthCheckModalActions, secretModalActions)),
  reduxForm({
    form: 'containerEdit',
    enableReinitialize: true,
    validate,
  })
)(ContainerEdit);

