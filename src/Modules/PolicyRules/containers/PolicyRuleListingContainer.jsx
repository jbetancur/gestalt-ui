import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import PolicyRuleItem from '../components/PolicyRuleItem';
import actions from '../actions';

class PolicyRuleListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policyRules: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    deletePolicyRules: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicyRules: PropTypes.func.isRequired,
    unloadPolicyRules: PropTypes.func.isRequired,
    policyRulesPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchPolicyRules } = this.props;

    fetchPolicyRules(match.params.fqon, match.params.policyId);
  }

  componentWillUnmount() {
    const { unloadPolicyRules } = this.props;

    unloadPolicyRules();
  }

  edit = (policyRule, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match, } = this.props;
      const ruleType = policyRule.resource_type.split(/[::]+/).pop();
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}/rules/${policyRule.id}/edit${ruleType.toLowerCase()}Rule`);
    }
  }

  delete = () => {
    const { match, fetchPolicyRules, deletePolicyRules, tableActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchPolicyRules(match.params.fqon, match.params.policyId);
    };

    this.props.confirmDelete(() => {
      deletePolicyRules(IDs, match.params.fqon, match.params.policyId, onSuccess);
    }, names);
  }

  render() {
    return (
      <PolicyRuleItem
        model={this.props.policyRules}
        pending={this.props.policyRulesPending}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

export default withMetaResource(connect(null, { ...actions })(withTableManager(PolicyRuleListing)));
