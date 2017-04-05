import React, { Component, PropTypes } from 'react';
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
    lambdaProvider: PropTypes.object.isRequired,
  };

  create(values) {
    const { params, router, createAPIEndpoint, lambdaProvider } = this.props;
    const payload = { ...values };

    payload.properties.upstream_url = `https://${lambdaProvider.properties.config.env.public.LAMBDA_DATABASE_NAME}/lambdas/${values.properties.implementation_id}/invoke`;
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
    description: '',
    properties: {
      // auth_type: {
      //   type: 'None',
      // },
      // http_method: 'GET',
      resource: '',
      upstream_url: '',
      implementation_id: '',
    }
  };

  return {
    apiEndpoint: model,
    pending,
    pendingAPIEndpoints: state.metaResource.apiEndpoints.pending,
    lambdaProvider: state.metaResource.lambdaProvider.provider,
    initialValues: model
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'apiEndpointCreate',
  validate
})(APIEndpointCreate));
