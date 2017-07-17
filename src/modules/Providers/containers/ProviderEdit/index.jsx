import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { containerActionCreators } from 'modules/Containers';
import jsonPatch from 'fast-json-patch';
import base64 from 'base-64';
import { map } from 'lodash';
import ActivityContainer from 'components/ActivityContainer';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../components/ProviderForm/validations';
import actions from '../../actions';

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
  };

  componentDidMount() {
    const { match, fetchProvider, fetchProvidersByType, fetchProviderContainer } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.enviromentId ? 'environments' : 'workspaces';

    fetchProvidersByType(match.params.fqon, entityId, entityKey);
    fetchProvider(match.params.fqon, match.params.providerId);
    fetchProviderContainer(match.params.fqon, match.params.providerId);
  }

  updatedModel(formValues, originalModel) {
    // normally we don't need the original model passed here, but we are replacing networks and config from a seperate ui control'
    const { name, description, properties } = formValues;
    const { locations } = properties;
    const model = {
      name,
      description,
      properties: {
        config: {
          env: {
            public: {},
            private: {},
          },
          extra: originalModel.properties.config.extra,
          networks: originalModel.properties.config.networks,
        },
        linked_providers: formValues.linkedProviders,
        locations,
      }
    };

    if (formValues.properties.config.url) {
      model.properties.config.url = formValues.properties.config.url;
    }

    if (formValues.properties.config.external_protocol) {
      model.properties.config.external_protocol = formValues.properties.config.external_protocol;
    }

    if (formValues.properties.config.auth) {
      model.properties.config.auth = formValues.properties.config.auth;
    }

    // override model only if form was changed
    if (formValues.properties.config.networks) {
      model.properties.config.networks = JSON.parse(formValues.properties.config.networks);
    }

    // Deal with silly extra property - this will eventually be removed
    if (formValues.properties.config.extra) {
      try {
        model.properties.config.extra = JSON.parse(formValues.properties.config.extra);
      } catch (e) {
        model.properties.config.extra = formValues.properties.config.extra;
      }
    }

    if (formValues.properties.data) {
      model.properties.data = base64.encode(formValues.properties.data);
    }

    formValues.privateVariables.forEach((variable) => {
      model.properties.config.env.private[variable.name] = variable.value;
    });

    formValues.publicVariables.forEach((variable) => {
      model.properties.config.env.public[variable.name] = variable.value;
    });

    return model;
  }

  originalModel(originalOrg) {
    const { name, description, properties } = originalOrg;
    const { config, locations, linked_providers } = properties;
    const model = {
      name,
      description,
      properties: {
        config,
        linked_providers,
        locations,
      }
    };

    return model;
  }


  update(formValues) {
    const { match, history, provider, updateProvider } = this.props;
    const originalModel = this.originalModel(this.props.provider);
    const updatedModel = this.updatedModel(formValues, originalModel);

    // Hack Alert: Since we dont want to treat networks as a patch array index
    // We can appease by always forcing an op add; by deleting the networks key on the original model
    if (formValues.properties.config.networks) {
      delete originalModel.properties.config.networks;
    }

    // Hack Alert: Since we dont want to treat linked_providers as a patch array index
    // We can appease by always forcing an op add; by deleting the linked_providers key on the original model
    if (formValues.properties.linked_providers) {
      delete originalModel.properties.linked_providers;
    }

    const patches = jsonPatch.compare(originalModel, updatedModel);

    let onSuccess;
    if (match.params.workspaceId && !match.params.environmentId) {
      onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);
    } else if (match.params.environmentId) {
      onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);
    } else {
      onSuccess = () => history.replace(`/${match.params.fqon}/providers`);
    }

    // If the provider has a container defined then warn the user of an impending container restart
    if (provider.properties.services && provider.properties.services.length) {
      this.props.confirmUpdate(() => updateProvider(match.params.fqon, provider.id, patches, onSuccess), provider.name);
    } else {
      updateProvider(match.params.fqon, provider.id, patches, onSuccess);
    }
  }

  render() {
    const { provider, providerPending } = this.props;
    return providerPending ? <ActivityContainer id="provider-load" /> :
    <ProviderForm
      editMode
      title={provider.name}
      submitLabel="Update"
      cancelLabel="Back"
      onSubmit={values => this.update(values)}
      {...this.props}
    />;
  }
}

function mapStateToProps(state) {
  const { provider } = state.metaResource.provider;
  const privateVariables = map(provider.properties.config.env.private, (value, name) => ({ name, value }));
  const publicVariables = map(provider.properties.config.env.public, (value, name) => ({ name, value }));
  const model = {
    name: provider.name,
    description: provider.description,
    resource_type: provider.resource_type,
    properties: {
      config: {
        auth: provider.properties.config.auth,
        url: provider.properties.config.url,
        external_protocol: provider.properties.config.external_protocol,
        env: {
          public: {},
          private: {},
        },
      },
      linked_providers: [],
      data: provider.properties.data ? base64.decode(provider.properties.data) : '',
      locations: provider.properties.locations,
      services: provider.properties.services,
    },
    publicVariables,
    privateVariables,
    linkedProviders: provider.properties.linked_providers,
  };

  return {
    initialValues: model,
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, containerActionCreators))(reduxForm({
  form: 'providerCreate',
  validate
})(withContext(ProviderEdit))));
