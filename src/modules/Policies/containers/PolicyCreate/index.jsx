import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import PolicyForm from '../../components/PolicyForm';
import validate from '../../validations';
import * as actions from '../../actions';

class PolicyCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createPolicy: PropTypes.func.isRequired,
  };

  create(values) {
    const { params, router, createPolicy } = this.props;
    const onSuccess = response => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${response.id}/edit`);
    createPolicy(params.fqon, params.environmentId, values, onSuccess);
  }

  render() {
    return <PolicyForm title="Create Policy" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.policy;
  const model = {
    name: '',
    description: '',
    properties: {}
  };

  return {
    policy: model,
    pending,
    initialValues: model
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'policyCreate',
  validate
})(PolicyCreate));
