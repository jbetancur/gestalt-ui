import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import PolicyLimitRuleForm from '../components/PolicyLimitRuleForm';
import validate from '../components/PolicyLimitRuleForm/validations';
import actions from '../actions';
import { generateLimitPolicyRulePayload } from '../payloadTransformer';

class PolicyLimitRuleCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createPolicyRule: PropTypes.func.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    selectedActions: PropTypes.array.isRequired,
  };

  componentWillUnmount() {
    this.props.clearSelectedActions();
  }

  create(values) {
    const { match, history, createPolicyRule, selectedActions } = this.props;
    const payload = generateLimitPolicyRulePayload(values, selectedActions);

    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`);
    createPolicyRule(match.params.fqon, match.params.policyId, payload, onSuccess);
  }

  render() {
    return (
      <PolicyLimitRuleForm
        title="Create Limit Rule"
        submitLabel="Create"
        cancelLabel="Policy"
        onSubmit={values => this.create(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
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
    selectedActions: state.policyRules.selectedActions.selectedActions,
    initialValues: model,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyLimitRuleCreate',
  validate
})(PolicyLimitRuleCreate)));
