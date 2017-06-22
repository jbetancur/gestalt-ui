import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { FormattedDate, FormattedTime } from 'react-intl';
import { DeleteIconButton } from 'components/Buttons';
import policyTypes from '../../lists/policyTypes';

class PolicyRuleItem extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policyRules: PropTypes.array.isRequired,
    selectedPolicyRules: PropTypes.object.isRequired,
    deletePolicyRules: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicyRules: PropTypes.func.isRequired,
    unloadPolicyRules: PropTypes.func.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
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

  handleRowToggle(row, toggled, count) {
    const { policyRules, handleTableSelected, selectedPolicyRules } = this.props;

    handleTableSelected(row, toggled, count, policyRules, selectedPolicyRules.selectedItems);
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

  edit(policyRule, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match, } = this.props;
      const ruleType = policyRule.resource_type.split(/[::]+/).pop();
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${match.params.policyId}/edit/rules/${policyRule.id}/edit${ruleType.toLowerCase()}Rule`);
    }
  }

  renderCreateMenuItems() {
    const { match } = this.props;

    return policyTypes.map(type => (
      <ListItem
        key={type.value}
        primaryText={type.displayName}
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${match.params.policyId}/edit/rules/create${type.name}Rule`}
      />)
    );
  }

  renderCreateButton() {
    return (
      <MenuButton
        id="create-policyRule"
        label="Create Policy Rule"
        flat
        primary
        fullWidth
        position="below"
        buttonChildren="add"
      >
        {this.renderCreateMenuItems()}
      </MenuButton>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedPolicyRules;
    const { handleTableSortIcon, sortTable } = this.props;

    const policyRules = this.props.policyRules.map(policyRule => (
      <TableRow key={policyRule.id} onClick={e => this.edit(policyRule, e)}>
        <TableColumn>{policyRule.name}</TableColumn>
        <TableColumn>{policyRule.description}</TableColumn>
        <TableColumn>{policyRule.resource_type.split('::')[policyRule.resource_type.split('::').length - 1]}</TableColumn>
        <TableColumn>{policyRule.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={policyRule.created.timestamp} /> <FormattedTime value={policyRule.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <Card tableCard>
        <TableCardHeader
          title={<div className="gf-headline">Policy Rules</div>}
          visible={selectedCount > 0}
          contextualTitle={`${selectedCount} policy rule${selectedCount > 1 ? 's' : ''} selected`}
          actions={[<DeleteIconButton onClick={() => this.delete()} />]}
        >
          <div>{this.renderCreateButton()}</div>
        </TableCardHeader>
        {this.props.pending ? <LinearProgress id="policyRule-listing" /> : null}
        <DataTable baseId="policyRules" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
          {!this.props.policyRules.length ? null :
          <TableHeader>
            <TableRow>
              <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
              <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
              <TableColumn sorted={handleTableSortIcon('resource_type')} onClick={() => sortTable('resource_type')}>Type</TableColumn>
              <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
              <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
            </TableRow>
          </TableHeader>}
          <TableBody>
            {policyRules}
          </TableBody>
        </DataTable>
      </Card>
    );
  }
}

export default PolicyRuleItem;
