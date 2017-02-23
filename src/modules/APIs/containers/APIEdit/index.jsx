import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import * as actions from '../../actions';

class APIEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    fetchAPI: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    updateAPI: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { params, fetchAPI } = this.props;
    fetchAPI(params.fqon, params.apiId);
  }

  componentWillUnmount() {
    const { onUnload } = this.props;
    onUnload();
  }

  updateAPI(values) {
    const { id, name, description } = this.props.api;
    const { params } = this.props;
    const originalModel = {
      name,
      description,
    };

    const patches = jsonPatch.compare(originalModel, values);

    this.props.updateAPI(params.fqon, params.workspaceId, params.environmentId, id, patches);
  }

  render() {
    const { api, pending } = this.props;
    return pending ? <CircularActivity id="api-loading" /> : <APIForm editMode title={api.name} submitLabel="Update" cancelLabel="Done" onSubmit={values => this.updateAPI(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { api, pending } = state.apis.fetchOne;

  const model = {
    name: api.name,
    description: api.description
  };

  return {
    api,
    pending,
    updatedApi: state.apis.apiUpdate.api,
    apiRuleUpdatePending: state.apis.apiUpdate.pending,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'apiEdit',
  validate
})(APIEdit));
