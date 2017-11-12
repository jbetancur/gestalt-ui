import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import { containerActionCreators } from 'Modules/Containers';
import { generateContextEntityState } from 'util/helpers/transformations';
import ActivityContainer from 'components/ActivityContainer';
import ProviderForm from '../components/ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPatches } from '../payloadTransformer';
import withResourceTypes from '../hocs/withResourceTypes';
import { getEditProviderModel } from '../selectors';

class ProviderEdit extends Component {
  static propTypes = {
    providerPending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    fetchProviderContainer: PropTypes.func.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    confirmUpdate: PropTypes.func.isRequired,
    redeployProvider: PropTypes.func.isRequired,
    resourceTypesPending: PropTypes.bool.isRequired,
    unloadProvider: PropTypes.func.isRequired,
    unloadProviders: PropTypes.func.isRequired,
    containerValues: PropTypes.object,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
    secretsFromModal: PropTypes.array.isRequired,
  };

  static defaultProps = {
    containerValues: {},
  };

  state = { redeploy: false };

  componentDidMount() {
    this.populateProvider();
    this.populateContainer();
  }

  componentWillUnmount() {
    const { unloadProviders, unloadProvider } = this.props;

    unloadProviders();
    unloadProvider();
  }

  setRedeployFlag = (redeploy) => {
    this.setState({ redeploy });
  }

  populateProvider() {
    const { match, fetchProvider, fetchProviders } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchProviders(match.params.fqon, entity.id, entity.key);
    fetchProvider(match.params.fqon, match.params.providerId);
  }

  populateContainer() {
    const { match, fetchProviderContainer } = this.props;

    fetchProviderContainer(match.params.fqon, match.params.providerId);
  }

  update = (formValues) => {
    const { match, confirmUpdate, provider, updateProvider, redeployProvider, fetchProviderContainer, containerValues, volumes, portMappings, healthChecks, secretsFromModal } = this.props;
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

    const patches = generateProviderPatches(provider, formValues, containerValues, mergeProps);

    const onSuccess = () => {
      if (this.state.redeploy) {
        // TODO: Pass in container form payload
        redeployProvider(match.params.fqon, provider.id);
      }

      fetchProviderContainer(match.params.fqon, match.params.providerId);
    };

    // Redeploy flag is set when the Update & Restart button is pressed
    if (this.state.redeploy) {
      const handleUpdate = () => {
        updateProvider(match.params.fqon, provider.id, patches, onSuccess);
      };

      confirmUpdate(handleUpdate, provider.name);
    } else {
      updateProvider(match.params.fqon, provider.id, patches, onSuccess);
    }
  }

  componentDidCatch(error, info) {
    // TODO: Eat errors related to calling fetchEnvSchema and redux-form FieldArrays and don't unmount the form
    this.setState({ hasError: true, error, info });
  }

  render() {
    const { provider, providerPending, resourceTypesPending } = this.props;
    return (
      <div>
        {(providerPending || resourceTypesPending) ?
          <ActivityContainer id="provider-loading" /> :
          <ProviderForm
            editMode
            title={provider.name}
            submitLabel="Update"
            cancelLabel="Providers"
            onSubmit={this.update}
            onRedeploy={this.setRedeployFlag}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    initialValues: getEditProviderModel(state),
    containerValues: getFormValues('containerEdit')(state),
    volumes: state.volumeModal.volumes.volumes,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
    secretsFromModal: state.secrets.secrets.secrets,
  };
}

export default compose(
  withMetaResource,
  withResourceTypes,
  connect(mapStateToProps, Object.assign({}, actions, containerActionCreators)),
  reduxForm({
    form: 'providerEdit',
    enableReinitialize: true,
    validate,
  })
)(ProviderEdit);
