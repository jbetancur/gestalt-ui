import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import jsonPatch from 'fast-json-patch';
import CircularActivity from 'components/CircularActivity';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../validations';
import * as actions from '../../actions';

class ProviderCreate extends Component {
  static propTypes = {
    pending: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { params, fetchProvider } = this.props;
    fetchProvider(params.fqon, params.providerId);
  }

  updatedModel(formValues, originalModel) {
    // normally we don't need the original model passed here, but we are replacing networks and config from a seperate ui control'
    const { name, description, properties } = formValues;
    const { config, locations } = properties;
    const model = {
      name,
      description,
      properties: {
        config: {
          auth: config.auth,
          url: config.url,
          extra: originalModel.properties.config.extra,
          networks: originalModel.properties.config.networks
        },
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

    return model;
  }

  originalModel(originalOrg) {
    const { name, description, properties } = originalOrg;
    const { config, locations } = properties;
    const model = {
      name,
      description,
      properties: {
        config,
        locations
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
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}`;
      updateProvider(params.fqon, provider.id, patches, routeToUrlWhenDone);
    } else if (params.environmentId) {
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`;
      updateProvider(params.fqon, provider.id, patches, routeToUrlWhenDone);
    } else {
      const routeToUrlWhenDone = `${params.fqon}/providers`;
      updateProvider(params.fqon, provider.id, patches, routeToUrlWhenDone);
    }
  }

  render() {
    const { provider, pending } = this.props;
    return pending ? <CircularActivity id="provider-load" /> : <ProviderForm title={provider.name} submitLabel="Update" cancelLabel="Cancel" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { item, pending } = state.providers.fetchOne;
  return {
    provider: item,
    pending,
    selectedProviderType: state.providers.selectedProvider.type,
    initialValues: {
      name: item.name,
      description: item.description,
      resource_type: item.resource_type,
      properties: {
        config: {
          auth: {
            scheme: item.properties.config.auth.scheme,
            username: item.properties.config.auth.username,
            password: item.properties.config.auth.password
          },
          url: item.properties.config.url,
        },
        locations: item.properties.locations
      }
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'providerCreate',
  validate
})(ProviderCreate));
