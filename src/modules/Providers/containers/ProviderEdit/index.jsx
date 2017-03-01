import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
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
    params: PropTypes.object.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params, fetchProvider, fetchProviders } = this.props;
    const entityId = params.environmentId || params.workspaceId || null;
    const entityKey = params.workspaceId && params.enviromentId ? 'environments' : 'workspaces';

    fetchProviders(params.fqon, entityId, entityKey);
    fetchProvider(params.fqon, params.providerId);
  }

  componentWillUnmount() {
    this.props.onUnload();
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
        locations
      }
    };

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


  update(values) {
    const { params, provider, updateProvider } = this.props;
    const originalModel = this.originalModel(this.props.provider);
    const updatedModel = this.updatedModel(values, originalModel);
    const patches = jsonPatch.compare(originalModel, updatedModel);

    if (params.workspaceId) {
      // const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}`;
      updateProvider(params.fqon, provider.id, patches);
    } else if (params.environmentId) {
      // const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`;
      updateProvider(params.fqon, provider.id, patches);
    } else {
      // const routeToUrlWhenDone = `${params.fqon}/providers`;
      updateProvider(params.fqon, provider.id, patches);
    }
  }

  render() {
    const { provider, pending } = this.props;
    return pending ? <CircularActivity id="provider-load" /> : <ProviderForm editMode title={provider.name} submitLabel="Update" cancelLabel="Back" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { provider, pending } = state.providers.fetchOne;
  const privateVariables = map(provider.properties.config.env.private, (value, name) => ({ name, value }));
  const publicVariables = map(provider.properties.config.env.public, (value, name) => ({ name, value }));

  return {
    provider,
    pending,
    updatePending: state.providers.updateOne.pending,
    pendingSchema: state.providers.selectedProviderSchema.pending,
    providers: state.providers.fetchAll.providers,
    pendingProviders: state.providers.fetchAll.pending,
    initialValues: {
      name: provider.name,
      description: provider.description,
      resource_type: provider.resource_type,
      properties: {
        config: {
          env: {
            public: {},
            private: {},
          },
        },
        linked_providers: [],
        data: provider.properties.data ? base64.decode(provider.properties.data) : '',
        locations: provider.properties.locations
      },
      publicVariables,
      privateVariables,
      linkedProviders: provider.properties.linked_providers,
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'providerCreate',
  validate
})(ProviderEdit));
