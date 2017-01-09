import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import ProviderForm from '../../components/ProviderForm';
import validate from '../../validations';
import * as actions from '../../actions';

class ProviderCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createProvider: PropTypes.func.isRequired
  };

  create(values) {
    const { params, createProvider } = this.props;
    if (params.workspaceId) {
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}`;
      createProvider(params.fqon, params.workspaceId, 'workspaces', values, routeToUrlWhenDone);
    } else if (params.environmentId) {
      const routeToUrlWhenDone = `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}`;
      createProvider(params.fqon, params.environmentId, 'environments', values, routeToUrlWhenDone);
    } else {
      const routeToUrlWhenDone = `${params.fqon}/providers`;
      createProvider(params.fqon, null, null, values, routeToUrlWhenDone);
    }
  }

  render() {
    return <ProviderForm title="Create Provider" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { item, pending } = state.providers.fetchOne;
  return {
    provider: item,
    pending,
    initialValues: {
      name: '',
      description: '',
      properties: {
        config: {
          auth: {
            scheme: '',
            username: '',
            password: ''
          },
          networks: [],
          url: '',
        },
        locations: [{ name: 'tobeimplemented', enabled: false }],
        parent: {}
      }
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'providerCreate',
  validate
})(ProviderCreate));
