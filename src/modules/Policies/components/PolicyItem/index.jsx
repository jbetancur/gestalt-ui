import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton } from 'components/Buttons';

class PolicyItem extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    policies: PropTypes.array.isRequired,
    selectedPolicies: PropTypes.object.isRequired,
    deletePolicies: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
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
    const { match, fetchPolicies } = this.props;
    fetchPolicies(match.params.fqon, match.params.environmentId);
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
    const { match, fetchPolicies, deletePolicies, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedPolicies;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchPolicies(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deletePolicies(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  edit(policy, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/${policy.id}/edit`);
    }
  }

  renderCreateButton() {
    const { match } = this.props;

    return (
      <Button
        id="create-policy"
        label="Create Policy"
        flat
        primary
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/policies/create`}
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
