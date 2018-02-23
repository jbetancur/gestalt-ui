import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import PolicyLimitRuleForm from '../components/PolicyLimitRuleForm';
import validate from '../components/PolicyLimitRuleForm/validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateLimitRuleModel } from '../selectors';

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
    const payload = generatePayload(values, selectedActions, false, 'limit');

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

const mapStateToProps = state => ({
  policyRule: getCreateLimitRuleModel(state),
  selectedActions: state.policyRules.selectedActions.selectedActions,
  initialValues: getCreateLimitRuleModel(state),
});

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyLimitRuleCreate',
  validate
})(PolicyLimitRuleCreate)));
