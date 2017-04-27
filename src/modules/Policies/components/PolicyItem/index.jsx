import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
import { FormattedDate, FormattedTime } from 'react-intl';
import { DeleteIconButton } from 'components/Buttons';

class PolicyItem extends PureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired,
    policies: PropTypes.array.isRequired,
    selectedPolicies: PropTypes.object.isRequired,
    deletePolicies: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicies: PropTypes.func.isRequired,
    unloadPolicies: PropTypes.func.isRequired,
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
    const { params, fetchPolicies } = this.props;
    fetchPolicies(params.fqon, params.environmentId);
  }

  componentWillUnmount() {
    const { unloadPolicies, clearTableSelected, clearTableSort } = this.props;
    unloadPolicies();
    clearTableSelected();
    clearTableSort();
  }

  handleRowToggle(row, toggled, count) {
    const { policies, handleTableSelected, selectedPolicies } = this.props;

    handleTableSelected(row, toggled, count, policies, selectedPolicies.selectedItems);
  }

  delete() {
    const { params, fetchPolicies, deletePolicies, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedPolicies;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchPolicies(params.fqon, params.environmentId);
    };

    this.props.confirmDelete(() => {
      deletePolicies(IDs, params.fqon, onSuccess);
    }, names);
  }

  edit(policy, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params } = this.props;
      router.push({
        pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/${policy.id}/edit`
      });
    }
  }

  renderCreateButton() {
    const { params } = this.props;

    return (
      <Button
        id="create-policy"
        label="Create Policy"
        flat
        primary
        component={Link}
        to={{
          pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/policies/create`
        }}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedPolicies;
    const { handleTableSortIcon, sortTable } = this.props;

    const policies = this.props.policies.map(policy => (
      <TableRow key={policy.id} onClick={e => this.edit(policy, e)}>
        <TableColumn>{policy.name}</TableColumn>
        <TableColumn>{policy.description}</TableColumn>
        <TableColumn>{policy.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={policy.created.timestamp} /> <FormattedTime value={policy.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Policies</div>}
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} polic${selectedCount > 1 ? 'ies' : 'y'} selected`}
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="policy-listing" /> : null}
          <DataTable baseId="policies" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.policies.length ? null :
            <TableHeader>
              <TableRow>
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {policies}
            </TableBody>
          </DataTable>
        </Card>
      </div>
    );
  }
}

export default PolicyItem;
