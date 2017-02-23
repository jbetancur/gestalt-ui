import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import * as actions from '../../actions';

class APICreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createAPI: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.onUnload();
  }

  create(values) {
    const { params, createAPI } = this.props;
    createAPI(params.fqon, params.workspaceId, params.environmentId, values);
  }

  render() {
    return <APIForm title="Create API" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.apis.fetchOne;
  const model = {
    name: '',
    description: '',
    properties: {}
  };

  return {
    api: model,
    pending,
    initialValues: model
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'APICreate',
  validate
})(APICreate));
