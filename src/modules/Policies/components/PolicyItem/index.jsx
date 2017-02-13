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
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate } from 'react-intl';

class PolicyItem extends Component {
  static propTypes = {
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    policies: PropTypes.array.isRequired,
    selectedPolicies: PropTypes.object.isRequired,
    handleSelected: PropTypes.func.isRequired,
    deletePolicies: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
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

  handleRowToggle(row, toggled, count) {
    const { policies, handleSelected, selectedPolicies } = this.props;

    handleSelected(row, toggled, count, policies, selectedPolicies.selectedItems);
  }

  delete() {
    const { params, deletePolicies } = this.props;
    const { selectedItems } = this.props.selectedPolicies;
    const IDs = selectedItems.map(item => (item.id));

    deletePolicies(IDs, params.fqon, params.environmentId);
  }

  edit(policy, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params, } = this.props;

      router.push(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${policy.id}/edit`);
    }
  }

  renderCreateButton() {
    const { fqon, environmentId, params } = this.props;

    return (
      <Button
        id="create-policy"
        label="Create Policy"
        flat
        component={Link}
        to={`${fqon}/workspaces/${params.workspaceId}/environments/${environmentId}/policies/create`}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedPolicies;
    const policies = this.props.policies.map(policy => (
      <TableRow key={policy.id} onClick={e => this.edit(policy, e)}>
        <TableColumn>{policy.name}</TableColumn>
        <TableColumn>{policy.description}</TableColumn>
        <TableColumn>{policy.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={policy.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Policy"
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} polic${selectedCount > 1 ? 'ies' : 'y'} selected`}
            actions={[<Button onClick={() => this.delete()} style={{ color: 'red' }} icon>delete</Button>]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="policy-listing" /> :
          <DataTable baseId="policies" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.policies.length ? null :
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Owner</TableColumn>
                <TableColumn>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {policies}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default PolicyItem;
