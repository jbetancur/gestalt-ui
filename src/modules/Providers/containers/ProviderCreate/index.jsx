import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import base64 from 'base-64';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../components/ProviderForm/validations';
import * as actions from '../../actions';

class ProviderCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createProvider: PropTypes.func.isRequired,
    /* container related */
    containerValues: PropTypes.object,
    volumes: PropTypes.array.isRequired,
    portMappings: PropTypes.array.isRequired,
    healthChecks: PropTypes.array.isRequired,
  };

  static defaultProps = {
    containerValues: {},
  };

  create(values) {
    const { params, router, createProvider } = this.props;
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
        services: [],
        linked_providers: values.linkedProviders,
        locations: properties.locations
      }
    };

    if (values.properties.config.url) {
      model.properties.config.url = values.properties.config.url;
    }

    if (values.properties.config.external_protocol) {
      model.properties.config.external_protocol = values.properties.config.external_protocol;
    }

    if (values.properties.config.auth) {
      model.properties.config.auth = values.properties.config.auth;
    }

    if (values.properties.config.portMappings) {
      model.properties.config.portMappings = JSON.parse(values.properties.config.portMappings);
    }

    if (values.properties.config.extra) {
      model.properties.config.extra = JSON.parse(values.properties.config.extra);
    }

    if (values.properties.config.networks) {
      model.properties.config.networks = JSON.parse(values.properties.config.networks);
    }

    if (values.properties.data) {
      model.properties.data = base64.encode(values.properties.data);
      delete model.properties.config.auth;
      delete model.properties.config.url;
      delete model.properties.portMappings;
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

    // Handle our container Form and map to the provider model
    if (Object.keys(this.props.containerValues).length) {
      const containerServiceModel = {
        init: {
          binding: 'eager',
          singleton: true
        },
        container_spec: {},
      };

      model.properties.services.push(containerServiceModel);
      model.properties.services[0].container_spec = this.props.containerValues;

      if (this.props.containerValues.variables) {
        this.props.containerValues.variables.forEach((variable) => {
          model.properties.services[0].container_spec.properties.env[variable.name] = variable.value;
        });
      }

      if (this.props.containerValues.labels) {
        this.props.containerValues.labels.forEach((label) => {
          model.properties.services[0].container_spec.properties.labels[label.name] = label.value;
        });
      }

      delete model.properties.services[0].container_spec.variables;
      delete model.properties.services[0].container_spec.labels;
    }

    if (this.props.volumes.length) {
      model.properties.services[0].container_spec.properties.volumes = this.props.volumes;
    }

    if (this.props.portMappings.length) {
      model.properties.services[0].container_spec.properties.port_mappings = this.props.portMappings;
    }

    if (this.props.healthChecks.length) {
      model.properties.services[0].container_spec.properties.health_checks = this.props.healthChecks;
    }

    let onSuccess;
    if (params.workspaceId && !params.environmentId) {
      onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}`);
    } else if (params.environmentId) {
      onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`);
    } else {
      onSuccess = () => router.replace(`${params.fqon}/providers`);
    }

    // Create it
    if (params.workspaceId && !params.environmentId) {
      createProvider(params.fqon, params.workspaceId, 'workspaces', model, onSuccess);
    } else if (params.environmentId) {
      createProvider(params.fqon, params.environmentId, 'environments', model, onSuccess);
    } else {
      createProvider(params.fqon, null, null, model, onSuccess);
    }
  }

  render() {
    return <ProviderForm title="Create Provider" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.provider;

  const model = {
    name: '',
    description: '',
    properties: {
      config: {
        auth: {},
        external_protocol: 'https',
        env: {
          public: {},
          private: {},
        },
      },
      linked_providers: [],
      services: [],
      locations: [],
    },
    publicVariables: state.metaResource.envSchema.schema.public,
    privateVariables: state.metaResource.envSchema.schema.private,
  };

  return {
    provider: model,
    pending,
    pendingSchema: state.metaResource.envSchema.pending,
    providers: state.metaResource.providers.providers,
    pendingProviders: state.metaResource.providers.pending,
    initialValues: model,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true, // keps dirty values in forms when the provider type is changed
    containerValues: getFormValues('containerCreate')(state),
    volumes: state.volumeModal.volumes.volumes,
    portMappings: state.portmapModal.portMappings.portMappings,
    healthChecks: state.healthCheckModal.healthChecks.healthChecks,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'providerCreate',
  validate,
})(ProviderCreate));
