import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import PolicyLimitRuleForm from '../../components/PolicyLimitRuleForm';
import validate from '../../components/PolicyLimitRuleForm/validations';
import actions from '../../actions';
import { generateLimitPolicyRulePatches } from '../../payloadTransformer';

class PolicyLimitRuleEdit extends Component {
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
    pristine: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicyRule } = this.props;
    fetchPolicyRule(match.params.fqon, match.params.policyId, match.params.ruleId);
  }

  componentWillReceiveProps(nextProps) {
    // propery.actions is an array of values that is not handled via redux form,
    // therefore, we have to load it manually in the redux state for selectedActions
    if (nextProps.policyRule.properties.actions && nextProps.policyRule !== this.props.policyRule) {
      this.props.handleSelectedActions(null, nextProps.policyRule.properties.actions);
    }
  }

  componentWillUnmount() {
    const { clearSelectedActions } = this.props;
    clearSelectedActions();
  }

  updatePolicyRule(values) {
    const { match, history, selectedActions, policyRule, updatePolicyRule } = this.props;

    const patches = generateLimitPolicyRulePatches(policyRule, values, selectedActions);

    if (patches.length) {
      const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${match.params.policyId}/edit`);
      updatePolicyRule(match.params.fqon, match.params.policyId, policyRule.id, patches, onSuccess);
    }
  }

  render() {
    const { policyRule, policyRulePending } = this.props;
    return policyRulePending ?
      <ActivityContainer id="policyRule-load" /> :
      <PolicyLimitRuleForm
        title={policyRule.name}
        submitLabel="Update"
        cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
        onSubmit={values => this.updatePolicyRule(values)}
        {...this.props}
      />;
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
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'policyLimitRuleEdit',
  validate
})(withContext(PolicyLimitRuleEdit))));
