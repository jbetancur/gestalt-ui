import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import { cloneDeep } from 'lodash';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import * as actions from '../../actions';

class APIEndpointEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    apiEndpoint: PropTypes.object.isRequired,
    fetchAPIEndpoint: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    updateAPIEndpoint: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { params, fetchAPIEndpoint } = this.props;
    fetchAPIEndpoint(params.fqon, params.apiId, params.apiEndpointId);
  }

  componentWillUnmount() {
    const { onUnload } = this.props;
    onUnload();
  }

  updateAPIEndpoint(values) {
    const { id, name, description, properties } = this.props.apiEndpoint;
    const { params } = this.props;
    const originalModel = {
      name,
      description,
      properties,
    };

    const payload = cloneDeep({ ...values });

    const patches = jsonPatch.compare(originalModel, payload);
    if (patches.length) {
      this.props.updateAPIEndpoint(params.fqon, params.apiId, id, patches);
    }
  }

  render() {
    const { apiEndpoint, pending } = this.props;
    return pending ? <CircularActivity id="apiEndpoint-loading" /> : <APIEndpointForm editMode title={apiEndpoint.name} submitLabel="Update" cancelLabel="Back" onSubmit={values => this.updateAPIEndpoint(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { apiEndpoint, pending } = state.apiEndpoints.fetchOne;

  const model = {
    name: apiEndpoint.name,
    description: apiEndpoint.description,
    properties: apiEndpoint.properties,
  };

  return {
    apiEndpoint,
    pending,
    updatedapiEndpoint: state.apiEndpoints.apiEndpointUpdate.apiEndpoint,
    apiEndpointUpdatePending: state.apiEndpoints.apiEndpointUpdate.pending,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'apiEndpointEdit',
  validate
})(APIEndpointEdit));