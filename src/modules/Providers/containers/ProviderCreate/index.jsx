import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import base64 from 'base-64';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../components/ProviderForm/validations';
import * as actions from '../../actions';

class ProviderCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createProvider: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.onUnload();
  }

  create(values) {
    const { params, createProvider } = this.props;
    const {
      name,
      description,
      resource_type,
      properties
     } = values;

    const model = {
      name,
      description,
      resource_type,
      properties: {
        config: {
          env: {
            public: {},
            private: {},
          },
        },
        linked_providers: values.linkedProviders,
        locations: properties.locations
      }
    };

    if (values.properties.config.networks) {
      model.properties.config.networks = JSON.parse(values.properties.config.networks);
    }

    if (values.properties.config.extra) {
      model.properties.config.extra = JSON.parse(values.properties.config.extra);
    }

    if (values.properties.data) {
      model.properties.data = base64.encode(values.properties.data);
      delete model.properties.config;
      delete model.properties.locations;
      delete model.properties.networks;
    }

    if (values.privateVariables) {
      values.privateVariables.forEach((variable) => {
        model.properties.config.env.private[variable.name] = variable.value;
      });
    }

    if (values.publicVariables) {
      values.publicVariables.forEach((variable) => {
        model.properties.config.env.public[variable.name] = variable.value;
      });
    }

    if (params.workspaceId && !params.environmentId) {
      // const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}`;
      createProvider(params.fqon, params.workspaceId, 'workspaces', model);
    } else if (params.environmentId) {
      // const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`;
      createProvider(params.fqon, params.environmentId, 'environments', model);
    } else {
      // const routeToUrlWhenDone = `${params.fqon}/providers`;
      createProvider(params.fqon, null, null, model);
    }
  }

  render() {
    return <ProviderForm title="Create Provider" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.providers.fetchOne;

  const model = {
    name: '',
    description: '',
    properties: {
      config: {
        env: {
          public: {},
          private: {},
        },
      },
      linked_providers: [],
      locations: [{ name: 'tobeimplemented', enabled: true }]
    },
    publicVariables: state.providers.selectedProviderSchema.public,
    privateVariables: state.providers.selectedProviderSchema.private
  };

  return {
    provider: model,
    pending,
    pendingSchema: state.providers.selectedProviderSchema.pending,
    providers: state.providers.fetchAll.providers,
    pendingProviders: state.providers.fetchAll.pending,
    initialValues: model,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true, // keps dirty values in forms when the provider type is changed
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'providerCreate',
  validate
})(ProviderCreate));
