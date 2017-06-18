import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { compact, cloneDeep } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import * as actions from '../../actions';

class APIEndpointCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
    rateLimitToggled: PropTypes.bool.isRequired,
  };

  create(values) {
    const { params, router, createAPIEndpoint, rateLimitToggled } = this.props;
    const payload = cloneDeep(values);
    payload.name = payload.properties.resource.split('/').join('-');

    // convert comma delimited string to an array and remove blank entries
    if (values.properties.methods) {
      payload.properties.methods = compact(values.properties.methods.split(','));
    }

    // clear the rate limit from the payload if it is not triggered
    if (!rateLimitToggled) {
      delete payload.properties.rateLimit;
    } else {
      // no need to submit to API since this is just used to manage form state
      delete payload.properties.rateLimit.toggled;
    }

    const onSuccess = () => router.replace(`${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/apis/${params.apiId}/edit`);
    createAPIEndpoint(params.fqon, params.apiId, payload, onSuccess);
  }

  render() {
    return (
      <APIEndpointForm
        title="Create Endpoint"
        submitLabel="Create"
        cancelLabel="Back"
        onSubmit={values => this.create(values)}
        {...this.props}
      />
    );
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
      methods: 'GET',  // converts to array
      rateLimit: {
        perMinute: 60,
      },
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
    lambdasDropDown: state.metaResource.lambdasDropDown.lambdas,
    containersDropDown: state.metaResource.containersDropDown.containers,
    rateLimitToggled: state.apiEndpoints.rateLimitToggled.toggled,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'apiEndpointCreate',
  validate
})(APIEndpointCreate));
