import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../validations';
import * as actions from '../../actions';

class ProviderCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fetchProvider: PropTypes.func.isRequired,
    updateProvider: PropTypes.func.isRequired,
    provider: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { params, fetchProvider } = this.props;
    fetchProvider(params.fqon, params.providerId);
  }

  update(values) {
    const { params, updateProvider } = this.props;

    if (params.workspaceId) {
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}`;
      updateProvider(params.fqon, params.workspaceId, 'workspaces', values, routeToUrlWhenDone);
    } else if (params.environmentId) {
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`;
      updateProvider(params.fqon, params.environmentId, 'environments', values, routeToUrlWhenDone);
    } else {
      const routeToUrlWhenDone = `${params.fqon}/providers`;
      updateProvider(params.fqon, null, null, values, routeToUrlWhenDone);
    }
  }

  render() {
    const { provider } = this.props;
    return <ProviderForm title={provider.name} submitLabel="Update" cancelLabel="Cancel" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { item, pending } = state.providers.fetchOne;
  return {
    provider: item,
    pending,
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
          networks: item.properties.config.networks,
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
