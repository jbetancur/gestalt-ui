import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'react-md/lib/Cards/Card';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons/Button';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { FormattedDate } from 'react-intl';
import policyTypes from '../../lists/policyTypes';

class PolicyRuleItem extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    policyRules: PropTypes.array.isRequired,
    selectedPolicyRules: PropTypes.object.isRequired,
    handleSelected: PropTypes.func.isRequired,
    deletePolicyRules: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicyRules: PropTypes.func.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: true,
      enableSelectAll: true,
      deselectOnClickaway: true,
      showCheckboxes: true
    };
  }

  componentWillMount() {
    const { params, fetchPolicyRules } = this.props;
    fetchPolicyRules(params.fqon, params.policyId);
  }

  componentWillUnmount() {
    const { onUnloadListing, clearSelected } = this.props;
    onUnloadListing();
    clearSelected();
  }

  handleRowToggle(row, toggled, count) {
    const { policyRules, handleSelected, selectedPolicyRules } = this.props;

    handleSelected(row, toggled, count, policyRules, selectedPolicyRules.selectedItems);
  }

  delete() {
    const { params, deletePolicyRules } = this.props;
    const { selectedItems } = this.props.selectedPolicyRules;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    this.props.confirmDelete(() => {
      deletePolicyRules(IDs, params.fqon, params.policyId);
    }, names);
  }

  edit(policyRule, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params, } = this.props;
      const ruleType = policyRule.resource_type.split(/[::]+/).pop();
      router.push({
        pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${params.policyId}/edit/rules/${policyRule.id}/edit${ruleType.toLowerCase()}Rule`
      });
    }
  }

  renderCreateMenuItems() {
    const { params } = this.props;

    return policyTypes.map(type =>
      <ListItem
        key={type.value}
        primaryText={type.displayName}
        component={Link}
        to={{
          pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${params.policyId}/edit/rules/create${type.name}Rule`
        }}
      />
    );
  }

  renderCreateButton() {
    return (
      <MenuButton
        id="create-policyRule"
        label="Create Policy Rule"
        flat
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
    const policyRules = this.props.policyRules.map(policyRule => (
      <TableRow key={policyRule.id} onClick={e => this.edit(policyRule, e)}>
        <TableColumn>{policyRule.name}</TableColumn>
        <TableColumn>{policyRule.description}</TableColumn>
        <TableColumn>{policyRule.resource_type.split('::')[policyRule.resource_type.split('::').length - 1]}</TableColumn>
        <TableColumn>{policyRule.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={policyRule.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <Card tableCard>
        <TableCardHeader
          title="Policy Rules"
          visible={selectedCount > 0}
          contextualTitle={`${selectedCount} policy rule${selectedCount > 1 ? 's' : ''} selected`}
          actions={[<Button onClick={() => this.delete()} style={{ color: 'red' }} icon>delete</Button>]}
        >
          <div>{this.renderCreateButton()}</div>
        </TableCardHeader>
        {this.props.pending ? <LinearProgress id="policyRule-listing" /> : null}
        <DataTable baseId="policyRules" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
          {!this.props.policyRules.length ? null :
          <TableHeader>
            <TableRow>
              <TableColumn>Name</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Owner</TableColumn>
              <TableColumn>Created</TableColumn>
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
