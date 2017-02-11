import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import PolicyForm from '../../components/PolicyForm';
import validate from '../../validations';
import * as actions from '../../actions';

class PolicyEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    policy: PropTypes.object.isRequired,
    fetchPolicy: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    updatePolicy: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { params, fetchPolicy } = this.props;
    fetchPolicy(params.fqon, params.policyId);
  }

  componentWillUnmount() {
    const { onUnload } = this.props;
    onUnload();
  }

  updatePolicy(values) {
    const { id, name, description } = this.props.policy;
    const { params } = this.props;
    const originalModel = {
      name,
      description,
    };

    const patches = jsonPatch.compare(originalModel, values);

    this.props.updatePolicy(params.fqon, params.workspaceId, params.environmentId, id, patches);
  }

  render() {
    const { policy, pending } = this.props;
    return pending ? <CircularActivity id="policy-load" /> : <PolicyForm editMode title={policy.name} submitLabel="Update" cancelLabel="Cancel" onSubmit={values => this.updatePolicy(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { policy, pending } = state.policies.fetchOne;

  const model = {
    name: policy.name,
    description: policy.description
  };

  return {
    policy,
    pending,
    updatedPolicy: state.policies.policyUpdate.policy,
    policyUpdatePending: state.policies.policyUpdate.pending,
    initialValues: model,
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'policyEdit',
  validate
})(PolicyEdit));
