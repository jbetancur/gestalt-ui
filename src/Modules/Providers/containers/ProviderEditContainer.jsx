import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import { containerActionCreators } from 'Modules/Containers';
import base64 from 'base-64';
import { mapTo2DArray, generateContextEntityState } from 'util/helpers/transformations';
import ActivityContainer from 'components/ActivityContainer';
import ProviderForm from '../components/ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPatches } from '../payloadTransformer';

class ProviderEdit extends PureComponent {
  static propTypes = {
    providerPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    fetchProviderContainer: PropTypes.func.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    confirmUpdate: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    redeployProvider: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = { redeploy: false };
  }

  componentDidMount() {
    const { match, fetchProvider, fetchProvidersByType, fetchProviderContainer } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchProvidersByType(match.params.fqon, entity.id, entity.key, null, false);
    fetchProvider(match.params.fqon, match.params.providerId);
    fetchProviderContainer(match.params.fqon, match.params.providerId);
  }

  setRedeployFlag = (redeploy) => {
    this.setState({ redeploy });
  }

  update = (formValues) => {
    const { match, history, confirmUpdate, provider, updateProvider, redeployProvider } = this.props;
    const patches = generateProviderPatches(provider, formValues);

    const goBack = () => {
      if (match.params.workspaceId && !match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`);
      } else if (match.params.workspaceId && match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`);
      } else {
        history.push(`/${match.params.fqon}/providers`);
      }
    };

    const onSuccess = () => {
      if (this.state.redeploy) {
        redeployProvider(match.params.fqon, provider.id, () => goBack());
      } else {
        goBack();
      }
    };

    // Redepopy flag is set when the Update & Restart button is pressed
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
    // TODO: Eeat errors related to calling fetchEnvSchema and redux-form FieldArrays and don't unmount the form
    this.setState({ hasError: true, error, info });
  }

  render() {
    const { provider, providerPending } = this.props;

    return (
      <div>
        {providerPending ?
          <ActivityContainer id="provider-load" /> :
          <ProviderForm
            title={provider.name}
            submitLabel="Update"
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={this.update}
            onRedeploy={this.setRedeployFlag}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { provider } = state.metaResource.provider;
  const model = {
    name: provider.name,
    description: provider.description,
    resource_type: provider.resource_type,
    properties: {
      environment_types: provider.properties.environment_types || [],
      config: {
        ...provider.properties.config,
        env: {
          public: mapTo2DArray(provider.properties.config.env.public),
          private: mapTo2DArray(provider.properties.config.env.private),
        },
        networks: JSON.stringify(provider.properties.config.networks),
        extra: JSON.stringify(provider.properties.config.extra),
      },
      linked_providers: provider.properties.linked_providers,
      data: provider.properties.data ? base64.decode(provider.properties.data) : '',
      locations: provider.properties.locations,
      services: provider.properties.services,
    },
  };

  // TODO: move this logic to reselect
  if (model.properties.environment_types && Array.isArray(model.properties.environment_types)) {
    model.properties.environment_types = model.properties.environment_types.join(',');
  }

  return {
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, containerActionCreators))(reduxForm({
  form: 'providerCreate',
  validate
})(withContext(ProviderEdit))));
