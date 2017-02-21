import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PolicyEventRuleForm from '../../components/PolicyEventRuleForm';
import validate from '../../components/PolicyEventRuleForm/validations';
import * as actions from '../../actions';

class PolicyEventRuleCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createPolicyRule: PropTypes.func.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    // fetchLambdas: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    onUnloadLambdas: PropTypes.func.isRequired,
    selectedActions: PropTypes.array.isRequired,
  };

  // componentWillMount() {
  //   const { params, fetchLambdas } = this.props;
  //   fetchLambdas(params.fqon, params.environmentId);
  // }

  componentWillUnmount() {
    this.props.onUnload();
    this.props.onUnloadLambdas();
    this.props.clearSelectedActions();
  }

  create(values) {
    const { params, createPolicyRule, selectedActions } = this.props;
    const payload = { ...values };
    payload.resource_type = 'event';
    payload.properties.actions = selectedActions;

    createPolicyRule(params.fqon, params.policyId, payload);
  }

  render() {
    return <PolicyEventRuleForm title="Create Event Rule" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.policies.fetchOne;
  const model = {
    name: '',
    description: '',
    properties: {
      lambda: '',
      actions: [],
    }
  };

  return {
    pending,
    selectedActions: state.policyRules.selectedActions.selectedActions,
    lambdas: state.policyRules.lambdas.lambdas,
    pendingLambdas: state.policyRules.lambdas.pending,
    initialValues: model
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'policyEventRuleCreate',
  validate
})(PolicyEventRuleCreate));
