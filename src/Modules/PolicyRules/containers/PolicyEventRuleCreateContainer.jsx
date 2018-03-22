import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import PolicyEventRuleForm from './PolicyEventRuleForm';
import validate from './PolicyEventRuleForm/validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateEventRuleModel } from '../selectors';

class PolicyEventRuleCreate extends Component {
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
    const payload = generatePayload(values, selectedActions, false, 'event');

    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`);
    createPolicyRule(match.params.fqon, match.params.policyId, payload, onSuccess);
  }

  render() {
    return (
      <PolicyEventRuleForm
        title="Create Event Rule"
        submitLabel="Create"
        cancelLabel="Policy"
        onSubmit={values => this.create(values)}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  policyRule: getCreateEventRuleModel(state),
  selectedActions: state.policyRules.selectedActions.selectedActions,
  initialValues: getCreateEventRuleModel(state),
});

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyEventRuleCreate',
  validate
})(PolicyEventRuleCreate)));
