import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../validations';
import * as actions from '../../actions';

class ProviderCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createProvider: PropTypes.func.isRequired,
    selectedProviderType: PropTypes.string.isRequired
  };

  create(values) {
    const { params, createProvider, selectedProviderType } = this.props;
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
          auth: properties.config.auth,
          url: properties.config.url
        },
        locations: properties.locations
      }
    };

    if (values.properties.config.networks && selectedProviderType === 'container') {
      model.properties.config.networks = JSON.parse(values.properties.config.networks);
    }

    if (values.properties.config.extra) {
      model.properties.config.extra = JSON.parse(values.properties.config.extra);
    }


    if (params.workspaceId) {
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}`;
      createProvider(params.fqon, params.workspaceId, 'workspaces', model, routeToUrlWhenDone);
    } else if (params.environmentId) {
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`;
      createProvider(params.fqon, params.environmentId, 'environments', model, routeToUrlWhenDone);
    } else {
      const routeToUrlWhenDone = `${params.fqon}/providers`;
      createProvider(params.fqon, null, null, model, routeToUrlWhenDone);
    }
  }

  render() {
    return <ProviderForm title="Create Provider" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.providers.fetchOne;

  const model = {
    name: '',
    description: '',
    properties: {
      config: {
        auth: {
          scheme: '',
          username: '',
          password: ''
        },
        extra: '',
        networks: '',
        url: '',
      },
      locations: [{ name: 'tobeimplemented', enabled: true }]
    }
  };

  return {
    provider: model,
    pending,
    selectedProviderType: state.providers.selectedProvider.type,
    initialValues: model
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'providerCreate',
  validate
})(ProviderCreate));
