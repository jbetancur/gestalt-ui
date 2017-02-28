import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import APIEndpointForm from '../../components/APIEndpointForm';
import validate from '../../components/APIEndpointForm/validations';
import * as actions from '../../actions';

class APIEndpointCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createAPIEndpoint: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.onUnload();
  }

  create(values) {
    const { params, createAPIEndpoint } = this.props;
    const payload = { ...values };

    createAPIEndpoint(params.fqon, params.apiId, payload);
  }

  render() {
    return <APIEndpointForm title="Create Endpoint" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.apiEndpoints.fetchOne;
  const model = {
    name: '',
    description: '',
    properties: {
      auth_type: {
        type: 'None',
      },
      http_method: 'GET',
      implementation: {
        type: 'Lambda',
      },
    }
  };

  return {
    apiEndpoint: model,
    pending,
    pendingAPIEndpoints: state.apiEndpoints.pending,
    initialValues: model
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'apiEndpointCreate',
  validate
})(APIEndpointCreate));
