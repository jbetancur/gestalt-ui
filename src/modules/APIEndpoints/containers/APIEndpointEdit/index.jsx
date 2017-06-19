import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import { cloneDeep, compact } from 'lodash';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import * as actions from '../../actions';

class APIEndpointEdit extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    apiEndpoint: PropTypes.object.isRequired,
    fetchAPIEndpoint: PropTypes.func.isRequired,
    updateAPIEndpoint: PropTypes.func.isRequired,
    fetchContainersDropDown: PropTypes.func.isRequired,
    fetchLambdasDropDown: PropTypes.func.isRequired,
    rateLimitToggled: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    unloadRateLimitToggleState: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { params, router, fetchAPIEndpoint, fetchContainersDropDown, fetchLambdasDropDown } = this.props;

    if (router.location.query.implementationType === 'container') {
      fetchContainersDropDown(params.fqon, params.environmentId);
    } else {
      fetchLambdasDropDown(params.fqon);
    }

    fetchAPIEndpoint(params.fqon, params.apiId, params.apiEndpointId);
  }

  componentWillUnmount() {
    this.props.unloadRateLimitToggleState();
  }

  updateAPIEndpoint(values) {
    const { id, name, description, properties } = this.props.apiEndpoint;
    const { params, router, rateLimitToggled } = this.props;
    const originalModel = {
      name,
      description,
      properties,
    };

    const payload = cloneDeep({ ...values });
    payload.name = payload.properties.resource.split('/').join('-');
    // meta patch cannot currently handle array patching - so force a replace on /properties/methods
    delete payload.properties.methods;

    // convert comma delimited strings  to an array and remove blank entries
    if (!Array.isArray(payload.properties.methods)) {
      payload.properties.methods = compact(values.properties.methods.split(','));
    }

    // clear the rate limit from the payload if it is not triggered
    if (!rateLimitToggled) {
      delete payload.properties.rateLimit;
    } else {
      // no need to submit to API since this is just used to manage form state
      delete payload.properties.rateLimit.toggled;
    }

    const patches = jsonPatch.compare(originalModel, payload);
    if (patches.length) {
      const onSuccess = () => router.replace(`${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/APIS/${params.apiId}/edit`);
      this.props.updateAPIEndpoint(params.fqon, params.apiId, id, patches, onSuccess);
    }
  }

  render() {
    const { apiEndpoint, pending } = this.props;
    return pending ?
      <CircularActivity id="apiEndpoint-loading" /> :
      <APIEndpointForm
        editMode
        title={apiEndpoint.properties.resource}
        submitLabel="Update"
        cancelLabel="Back"
        onSubmit={values => this.updateAPIEndpoint(values)}
        {...this.props}
      />;
  }
}

function mapStateToProps(state) {
  const { apiEndpoint, pending } = state.metaResource.apiEndpoint;

  const model = {
    name: apiEndpoint.name,
    description: apiEndpoint.description,
    properties: apiEndpoint.properties,
  };

  if (model.properties.methods && Array.isArray(model.properties.methods)) {
    model.properties.methods = model.properties.methods.join(',');
  }

  return {
    apiEndpoint,
    pending,
    updatedapiEndpoint: state.metaResource.apiEndpointUpdate.apiEndpoint,
    apiEndpointUpdatePending: state.metaResource.apiEndpointUpdate.pending,
    lambdaProvider: state.metaResource.lambdaProvider.provider,
    lambdasDropDown: state.metaResource.lambdasDropDown.lambdas,
    containersDropDown: state.metaResource.containersDropDown.containers,
    lambdasDropDownPending: state.metaResource.lambdasDropDown.pending,
    containersDropDownPending: state.metaResource.containersDropDown.pending,
    rateLimitToggled: state.apiEndpoints.rateLimitToggled.toggled,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'apiEndpointEdit',
  validate
})(APIEndpointEdit));
