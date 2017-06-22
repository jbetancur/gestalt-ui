import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import { context } from 'modules/ContextManagement';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import { cloneDeep, compact } from 'lodash';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import actions from '../../actions';

class APIEndpointEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
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
    const { match, history, fetchAPIEndpoint, fetchContainersDropDown, fetchLambdasDropDown } = this.props;

    if (history.location.query.implementationType === 'container') {
      fetchContainersDropDown(match.params.fqon, match.params.environmentId);
    } else {
      fetchLambdasDropDown(match.params.fqon);
    }

    fetchAPIEndpoint(match.params.fqon, match.params.apiId, match.params.apiEndpointId);
  }

  componentWillUnmount() {
    this.props.unloadRateLimitToggleState();
  }

  updateAPIEndpoint(values) {
    const { id, name, description, properties } = this.props.apiEndpoint;
    const { match, history, rateLimitToggled } = this.props;
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
      const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/APIS/${match.params.apiId}/edit`);
      this.props.updateAPIEndpoint(match.params.fqon, match.params.apiId, id, patches, onSuccess);
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
})(context(APIEndpointEdit)));
