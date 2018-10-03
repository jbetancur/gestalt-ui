import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PolicyLimitRuleForm from './PolicyLimitRuleForm';
import validate from './PolicyLimitRuleForm/validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateLimitRuleModel } from '../selectors';
import withPolicyRule from '../hocs/withPolicyRule';

class PolicyLimitRuleCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    policyRuleActions: PropTypes.object.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    selectedActions: PropTypes.array.isRequired,
  };

  componentWillUnmount() {
    this.props.clearSelectedActions();
  }

  create(values) {
    const { match, history, policyRuleActions, selectedActions } = this.props;
    const payload = generatePayload(values, selectedActions, false, 'limit');
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`);

    policyRuleActions.createPolicyRule({ fqon: match.params.fqon, entityId: match.params.policyId, entityKey: 'policies', payload, onSuccess });
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

const mapStateToProps = state => ({
  policyRule: getCreateLimitRuleModel(state),
  selectedActions: state.policyRules.selectedActions.selectedActions,
  initialValues: getCreateLimitRuleModel(state),
});

export default withPolicyRule(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyLimitRuleCreate',
  validate
})(PolicyLimitRuleCreate)));
