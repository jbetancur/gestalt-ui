import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import PolicyForm from '../../components/PolicyForm';
import validate from '../../validations';
import actions from '../../actions';

class PolicyCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createPolicy: PropTypes.func.isRequired,
  };

  create(values) {
    const { match, history, createPolicy } = this.props;
    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${response.id}/edit`);
    createPolicy(match.params.fqon, match.params.environmentId, values, onSuccess);
  }

  render() {
    return <PolicyForm title="Create Policy" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { policyPending } = state.metaResource.policy;
  const model = {
    name: '',
    description: '',
    properties: {},
  };

  return {
    policy: model,
    policyPending,
    initialValues: model
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyCreate',
  validate
})(withContext(PolicyCreate))));
