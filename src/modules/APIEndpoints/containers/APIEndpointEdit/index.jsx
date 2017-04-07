import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isUUID } from 'validator';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import { cloneDeep } from 'lodash';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import * as actions from '../../actions';

class APIEndpointEdit extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    apiEndpoint: PropTypes.object.isRequired,
    fetchAPIEndpoint: PropTypes.func.isRequired,
    fetchLambdaProvider: PropTypes.func.isRequired,
    updateAPIEndpoint: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    lambdaProvider: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { params, fetchAPIEndpoint, fetchLambdaProvider } = this.props;
    const onSuccess = (response) => {
      if (response.properties.implementation_id && isUUID(response.properties.implementation_id)) {
        fetchLambdaProvider(params.fqon, response.properties.implementation_id);
      }
    };

    fetchAPIEndpoint(params.fqon, params.apiId, params.apiEndpointId, onSuccess);
  }

  updateAPIEndpoint(values) {
    const { id, name, description, properties } = this.props.apiEndpoint;
    const { params, router, lambdaProvider } = this.props;
    const originalModel = {
      name,
      description,
      properties,
    };

    const payload = cloneDeep({ ...values });
    const { SERVICE_HOST, SERVICE_PORT } = lambdaProvider.properties.config.env.public;
    const upstreamURL = `http://${SERVICE_HOST}:${SERVICE_PORT || 80}/lambdas/${values.properties.implementation_id}/invoke`;
    payload.properties.upstream_url = upstreamURL;

    const patches = jsonPatch.compare(originalModel, payload);
    if (patches.length) {
      const onSuccess = () => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/APIS/${params.apiId}/edit`);
      this.props.updateAPIEndpoint(params.fqon, params.apiId, id, patches, onSuccess);
    }
  }

  render() {
    const { apiEndpoint, pending } = this.props;
    return pending ? <CircularActivity id="apiEndpoint-loading" /> : <APIEndpointForm editMode title={apiEndpoint.name} submitLabel="Update" cancelLabel="Back" onSubmit={values => this.updateAPIEndpoint(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { apiEndpoint, pending } = state.metaResource.apiEndpoint;

  const model = {
    name: apiEndpoint.name,
    description: apiEndpoint.description,
    properties: apiEndpoint.properties,
  };

  return {
    apiEndpoint,
    pending,
    updatedapiEndpoint: state.metaResource.apiEndpointUpdate.apiEndpoint,
    apiEndpointUpdatePending: state.metaResource.apiEndpointUpdate.pending,
    lambdaProvider: state.metaResource.lambdaProvider.provider,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'apiEndpointEdit',
  validate
})(APIEndpointEdit));
