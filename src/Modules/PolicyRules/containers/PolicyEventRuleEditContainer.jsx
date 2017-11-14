import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import PolicyEventRuleForm from '../components/PolicyEventRuleForm';
import validate from '../components/PolicyEventRuleForm/validations';
import actions from '../actions';
import { generateEventPolicyRulePatches } from '../payloadTransformer';

class PolicyEventRuleEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    policyRule: PropTypes.object.isRequired,
    fetchPolicyRule: PropTypes.func.isRequired,
    updatePolicyRule: PropTypes.func.isRequired,
    policyRulePending: PropTypes.bool.isRequired,
    selectedActions: PropTypes.array.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    handleSelectedActions: PropTypes.func.isRequired,
    unloadPolicyRule: PropTypes.func.isRequired,
    // fetchLambdas: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicyRule } = this.props;
    fetchPolicyRule(match.params.fqon, match.params.policyId, match.params.ruleId);
    // fetchLambdas(match.params.fqon, match.params.environmentId);
  }

  componentWillReceiveProps(nextProps) {
    // propery.actions is an array of values that is not handled via redux form,
    // therefore, we have to load it manually in the redux state for selectedActions
    if (nextProps.policyRule.properties.actions && nextProps.policyRule !== this.props.policyRule) {
      this.props.handleSelectedActions(null, nextProps.policyRule.properties.actions);
    }
  }

  componentWillUnmount() {
    const { clearSelectedActions, unloadPolicyRule } = this.props;

    unloadPolicyRule();
    clearSelectedActions();
  }

  updatePolicyRule(values) {
    const { match, history, policyRule, updatePolicyRule, selectedActions } = this.props;
    const patches = generateEventPolicyRulePatches(policyRule, values, selectedActions);

    if (patches.length) {
      const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`);

      updatePolicyRule(match.params.fqon, match.params.policyId, policyRule.id, patches, onSuccess);
    }
  }

  render() {
    const { policyRule, policyRulePending } = this.props;

    return (
      <div>
        {policyRulePending ?
          <ActivityContainer id="policyRule-load" /> :
          <PolicyEventRuleForm
            editMode
            title={policyRule.name}
            submitLabel="Update"
            cancelLabel={`${policyRule.properties.parent && policyRule.properties.parent.name} Policy`}
            onSubmit={values => this.updatePolicyRule(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { policyRule } = state.metaResource.policyRule;

  const model = {
    name: policyRule.name,
    description: policyRule.description,
    properties: policyRule.properties,
  };

  return {
    selectedActions: state.policyRules.selectedActions.selectedActions,
    initialValues: model,
  };
}

export default compose(
  withMetaResource,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'policyEventRuleEdit',
    enableReinitialize: true,
    validate,
  }),
)(PolicyEventRuleEdit);
