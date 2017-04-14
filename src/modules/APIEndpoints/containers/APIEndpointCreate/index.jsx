import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import * as actions from '../../actions';

class APIEndpointCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
  };

  create(values) {
    const { params, router, createAPIEndpoint } = this.props;
    const payload = { ...values };

    const onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/apis/${params.apiId}/edit`);
    createAPIEndpoint(params.fqon, params.apiId, payload, onSuccess);
  }

  render() {
    return <APIEndpointForm title="Create Endpoint" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.apiEndpoint;
  const model = {
    name: '',
    properties: {
      // auth_type: {
      //   type: 'None',
      // },
      // http_method: 'GET',
      implementation_type: 'lambda',
      resource: '',
      implementation_id: '',
      synchronous: true,
    }
  };

  return {
    apiEndpoint: model,
    pending,
    pendingAPIEndpoints: state.metaResource.apiEndpoints.pending,
    lambdaProvider: state.metaResource.lambdaProvider.provider,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'apiEndpointCreate',
  validate
})(APIEndpointCreate));
