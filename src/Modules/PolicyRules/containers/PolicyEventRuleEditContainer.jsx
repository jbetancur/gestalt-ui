import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withPolicyRule } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import PolicyEventRuleForm from './PolicyEventRuleForm';
import validate from './PolicyEventRuleForm/validations';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditEventRuleModel, selectRule } from '../selectors';

class PolicyEventRuleEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    policyRule: PropTypes.object.isRequired,
    policyRuleActions: PropTypes.object.isRequired,
    policyRulePending: PropTypes.bool.isRequired,
    selectedActions: PropTypes.array.isRequired,
    clearSelectedActions: PropTypes.func.isRequired,
    handleSelectedActions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, policyRuleActions } = this.props;

    policyRuleActions.fetchPolicyRule({ fqon: match.params.fqon, id: match.params.ruleId });
  }

  componentWillReceiveProps(nextProps) {
    // property.match_actions is an array of values that is not handled via redux form,
    // therefore, we have to load it manually in the redux state for selectedActions
    if (nextProps.policyRule.properties.match_actions && nextProps.policyRule !== this.props.policyRule) {
      this.props.handleSelectedActions(null, nextProps.policyRule.properties.match_actions);
    }
  }

  componentWillUnmount() {
    const { clearSelectedActions } = this.props;

    clearSelectedActions();
  }

  update = (values) => {
    const { match, history, policyRule, policyRuleActions, selectedActions } = this.props;
    const payload = generatePatches(policyRule, values, selectedActions, 'event');

    if (payload.length) {
      const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}`);

      policyRuleActions.updatePolicyRule({ fqon: match.params.fqon, id: policyRule.id, payload, onSuccess });
    }
  }

  render() {
    const { policyRule, policyRulePending } = this.props;

    return (
      <div>
        {policyRulePending && !policyRule.id ?
          <ActivityContainer id="policyRule-load" /> :
          <PolicyEventRuleForm
            editMode
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
  initialValues: getEditEventRuleModel(state),
});

export default compose(
  withPolicyRule,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'policyEventRuleEdit',
    enableReinitialize: true,
    validate,
  }),
)(PolicyEventRuleEdit);
