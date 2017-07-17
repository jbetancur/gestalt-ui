import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import PolicyRuleItem from '../../components/PolicyRuleItem';
import actions from '../../actions';

class PolicyRuleListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policyRules: PropTypes.array.isRequired,
    selectedPolicyRules: PropTypes.object.isRequired,
    deletePolicyRules: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicyRules: PropTypes.func.isRequired,
    unloadPolicyRules: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    policyRulesPending: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const { match, fetchPolicyRules } = this.props;
    fetchPolicyRules(match.params.fqon, match.params.policyId);
  }

  componentWillUnmount() {
    const { unloadPolicyRules, clearTableSelected, clearTableSort } = this.props;
    unloadPolicyRules();
    clearTableSelected();
    clearTableSort();
  }

  create(type) {
    const { match, history } = this.props;
    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${match.params.policyId}/edit/rules/create${type.name}Rule`);
  }

  edit(policyRule, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match, } = this.props;
      const ruleType = policyRule.resource_type.split(/[::]+/).pop();
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${match.params.policyId}/edit/rules/${policyRule.id}/edit${ruleType.toLowerCase()}Rule`);
    }
  }

  delete() {
    const { match, fetchPolicyRules, deletePolicyRules, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedPolicyRules;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
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
        onCreateToggle={this.create}
        onEditToggle={this.edit}
        onDeleteToggle={this.delete}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    policyRules: orderBy(state.metaResource.policyRules.policyRules, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedPolicyRules: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(withContext(PolicyRuleListing)));
