import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import { containerActionCreators } from 'modules/Containers';
import jsonPatch from 'fast-json-patch';
import base64 from 'base-64';
import { map } from 'lodash';
import CircularActivity from 'components/CircularActivity';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../components/ProviderForm/validations';
import * as actions from '../../actions';

class ProviderEdit extends Component {
  static propTypes = {
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchProviderContainer: PropTypes.func.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    confirmUpdate: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params, fetchProvider, fetchProviders, fetchProviderContainer } = this.props;
    const entityId = params.environmentId || params.workspaceId || null;
    const entityKey = params.workspaceId && params.enviromentId ? 'environments' : 'workspaces';

    fetchProviders(params.fqon, entityId, entityKey);
    fetchProvider(params.fqon, params.providerId);
    fetchProviderContainer(params.fqon, params.providerId);
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
    const { params, router, provider, updateProvider } = this.props;
    const originalModel = this.originalModel(this.props.provider);
    const updatedModel = this.updatedModel(formValues, originalModel);

    // Hack Alert: Since we dont want to treat networks as a patch array index
    // We can appease by always forcing an op add; by deleting the networks key on the original model
    if (formValues.properties.config.networks) {
      delete originalModel.properties.config.networks;
    }

    const patches = jsonPatch.compare(originalModel, updatedModel);

    let onSuccess;
    if (params.workspaceId && !params.environmentId) {
      onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}`);
    } else if (params.environmentId) {
      onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`);
    } else {
      onSuccess = () => router.replace(`${params.fqon}/providers`);
    }


    // If the provider has a container defined then warn the user of an impending container restart
    if (provider.properties.services && provider.properties.services.length) {
      this.props.confirmUpdate(() => updateProvider(params.fqon, provider.id, patches, onSuccess), provider.name);
    } else {
      updateProvider(params.fqon, provider.id, patches, onSuccess);
    }
  }

  render() {
    const { provider, pending } = this.props;
    return pending ? <CircularActivity id="provider-load" /> : <ProviderForm editMode title={provider.name} submitLabel="Update" cancelLabel="Back" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { provider, pending } = state.metaResource.provider;
  const privateVariables = map(provider.properties.config.env.private, (value, name) => ({ name, value }));
  const publicVariables = map(provider.properties.config.env.public, (value, name) => ({ name, value }));

  return {
    provider,
    pending,
    updatePending: state.metaResource.providerUpdate.pending,
    pendingSchema: state.metaResource.envSchema.pending,
    providers: state.metaResource.providers.providers,
    pendingProviders: state.metaResource.providers.pending,
    container: state.metaResource.container.container,
    initialValues: {
      name: provider.name,
      description: provider.description,
      resource_type: provider.resource_type,
      properties: {
        config: {
          auth: provider.properties.config.auth,
          url: provider.properties.config.url,
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
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, containerActionCreators))(reduxForm({
  form: 'providerCreate',
  validate
})(ProviderEdit));
