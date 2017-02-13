import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PolicyLimitRuleForm from '../../components/PolicyLimitRuleForm';
import validate from '../../components/PolicyLimitRuleForm/validations';
import * as actions from '../../actions';

class PolicyRuleCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createPolicyRule: PropTypes.func.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    selectedActions: PropTypes.array.isRequired,
  };

  componentWillUnmount() {
    this.props.onUnload();
    this.props.clearSelectedActions();
  }

  create(values) {
    const { params, createPolicyRule, selectedActions } = this.props;
    const payload = { ...values };
    payload.resource_type = 'limit';
    payload.properties.actions = selectedActions;

    createPolicyRule(params.fqon, params.policyId, payload);
  }

  render() {
    return <PolicyLimitRuleForm title="Create Policy Rule" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.policies.fetchOne;
  const model = {
    name: '',
    description: '',
    properties: {
      strict: false,
      actions: [],
      eval_logic: {},
    }
  };

  return {
    pending,
    selectedActions: state.policyRules.selectedActions.selectedActions,
    initialValues: model
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'policyRuleCreate',
  validate
})(PolicyRuleCreate));
