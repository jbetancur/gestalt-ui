import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import PolicyLimitRuleForm from '../../components/PolicyLimitRuleForm';
import validate from '../../components/PolicyLimitRuleForm/validations';
import * as actions from '../../actions';

class PolicyLimitRuleCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createPolicyRule: PropTypes.func.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    selectedActions: PropTypes.array.isRequired,
  };

  componentWillUnmount() {
    this.props.clearSelectedActions();
  }

  create(values) {
    const { params, router, createPolicyRule, selectedActions } = this.props;
    const payload = { ...values };
    payload.resource_type = 'Gestalt::Resource::Rule::Limit';
    payload.properties.actions = selectedActions;

    const onSuccess = () => router.replace(`${params.fqon}/hierarchy/${params.workspaceId}/environments/${params.environmentId}/policies/${params.policyId}/edit`);
    createPolicyRule(params.fqon, params.policyId, payload, onSuccess);
  }

  render() {
    return <PolicyLimitRuleForm title="Create Limit Rule" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.policy;
  const model = {
    name: '',
    description: '',
    properties: {
      parent: {},
      strict: false,
      actions: [],
      eval_logic: {},
    }
  };

  return {
    policyRule: model,
    pending,
    selectedActions: state.policyRules.selectedActions.selectedActions,
    initialValues: model,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'policyLimitRuleCreate',
  validate
})(PolicyLimitRuleCreate));
