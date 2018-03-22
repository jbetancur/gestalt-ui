import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import PolicyLimitRuleForm from './PolicyLimitRuleForm';
import validate from './PolicyLimitRuleForm/validations';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditLimitRuleModel, selectRule } from '../selectors';

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
    unloadPolicyRule: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicyRule } = this.props;
    fetchPolicyRule(match.params.fqon, match.params.policyId, match.params.ruleId);
  }

  componentWillReceiveProps(nextProps) {
    // propery.match_actions is an array of values that is not handled via redux form,
    // therefore, we have to load it manually in the redux state for selectedActions
    if (nextProps.policyRule.properties.match_actions && nextProps.policyRule !== this.props.policyRule) {
      this.props.handleSelectedActions(null, nextProps.policyRule.properties.match_actions);
    }
  }

  componentWillUnmount() {
    const { clearSelectedActions, unloadPolicyRule } = this.props;

    unloadPolicyRule();
    clearSelectedActions();
  }

  update = (values) => {
    const { match, history, selectedActions, policyRule, updatePolicyRule } = this.props;

    const patches = generatePatches(policyRule, values, selectedActions, 'limit');

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
          <PolicyLimitRuleForm
            title={policyRule.name}
            submitLabel="Update"
            cancelLabel={`${policyRule.properties.parent && policyRule.properties.parent.name} Policy`}
            onSubmit={this.update}
            {...this.props}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  policyRule: selectRule(state),
  selectedActions: state.policyRules.selectedActions.selectedActions,
  initialValues: getEditLimitRuleModel(state),
});

export default compose(
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'policyLimitRuleEdit',
    enableReinitialize: true,
    validate,
  })
)(PolicyLimitRuleEdit);
