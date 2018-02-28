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
import { generatePatches } from '../payloadTransformer';
import { getEditEventRuleModel, selectRule } from '../selectors';

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
    // property.actions is an array of values that is not handled via redux form,
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

  update = (values) => {
    const { match, history, policyRule, updatePolicyRule, selectedActions } = this.props;
    const patches = generatePatches(policyRule, values, selectedActions, 'event');

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
  withMetaResource,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'policyEventRuleEdit',
    enableReinitialize: true,
    validate,
  }),
)(PolicyEventRuleEdit);
