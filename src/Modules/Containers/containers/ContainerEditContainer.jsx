import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import { generateContextEntityState } from 'util/helpers/context';
import { volumeModalActions } from 'Modules/VolumeModal';
import { healthCheckModalActions } from 'Modules/HealthCheckModal';
import { secretModalActions } from 'Modules/Secrets';
import { getLastFromSplit } from 'util/helpers/strings';
import ContainerForm from '../components/ContainerForm';
import validate from '../validations';
import actions from '../actions';
import { generateContainerPayload } from '../payloadTransformer';
import {
  getEditContainerModel,
  getEditContainerModelAsSpec,
  selectContainer,
  getContainerInstances,
  getContainerServiceAddresses
} from '../selectors';

class ContainerEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    fetchContainer: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
    updateContainer: PropTypes.func.isRequired,
    containerPending: PropTypes.bool.isRequired,
    volumes: PropTypes.array.isRequired,
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
    const { match, fetchProvidersByType, fetchAPIEndpoints, fetchActions } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchProvidersByType(match.params.fqon, entity.id, entity.key, 'CaaS');

    if (!this.props.inlineMode) {
      this.populateContainer();
      fetchActions(match.params.fqon, entity.id, entity.key, { filter: 'container.detail' });
      fetchAPIEndpoints(match.params.fqon, match.params.containerId, 'container');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.container !== nextProps.container) {
      clearTimeout(this.timeout);

      if (!nextProps.containerPending) {
        this.startPoll();
      }

      // TODO: temporary until we support all providers
      if (!this.secretsPolled && getLastFromSplit(nextProps.container.properties.provider.resource_type) !== 'Docker') {
        this.secretsPolled = true;
        this.props.fetchSecretsDropDown(nextProps.match.params.fqon, nextProps.match.params.environmentId, nextProps.container.properties.provider.id);
      }
    }
  }

  componentWillUnmount() {
    const { unloadContainer, unloadAPIEndpoints, unloadVolumes, unloadSecretsModal } = this.props;

    unloadContainer();
    unloadAPIEndpoints();
    unloadVolumes();
    unloadSecretsModal();
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
    const { match, container, updateContainer, volumes, healthChecks, secretsFromModal } = this.props;
    const mergeProps = [
      {
        key: 'volumes',
        value: volumes,
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
    const { container, containerPending, inlineMode } = this.props;

    return (
      <div>
        {containerPending && !container.id ?
          <ActivityContainer id="container-load" /> :
          <ContainerForm
            editMode
            inlineMode={inlineMode}
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

const formName = 'containerEdit';
const mapStateToProps = (state, ownProps) => ({
  container: ownProps.containerSpec || selectContainer(state),
  containerInstances: getContainerInstances(state),
  containerServiceAddresses: getContainerServiceAddresses(state),
  volumeModal: state.volumeModal.volumeModal,
  healthCheckModal: state.healthCheckModal.healthCheckModal,
  secretPanelModal: state.secrets.secretPanelModal,
  healthChecks: state.healthCheckModal.healthChecks.healthChecks,
  volumes: state.volumeModal.volumes.volumes,
  secretsFromModal: state.secrets.secrets.secrets,
  initialValues: ownProps.containerSpec ? getEditContainerModelAsSpec(state, ownProps.containerSpec) : getEditContainerModel(state),
});

export default compose(
  withMetaResource,
  withRouter,
  connect(mapStateToProps,
    Object.assign({}, actions, volumeModalActions, healthCheckModalActions, secretModalActions)),
  reduxForm({
    form: formName,
    enableReinitialize: true,
    validate,
  })
)(ContainerEdit);

