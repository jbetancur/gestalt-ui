import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import Breadcrumbs from 'modules/Breadcrumbs';
import { Button, DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class GroupItem extends PureComponent {
  static propTypes = {
    fetchGroups: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    deleteGroups: PropTypes.func.isRequired,
    unloadGroups: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    selectedGroups: PropTypes.object.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchGroups, params } = this.props;
    fetchGroups(params.fqon);
  }

  componentWillUnmount() {
    const { unloadGroups, clearTableSelected, clearTableSort } = this.props;
    unloadGroups();
    clearTableSelected();
    clearTableSort();
  }

  handleRowToggle(row, toggled, count) {
    const { groups, handleTableSelected, selectedGroups } = this.props;

    handleTableSelected(row, toggled, count, groups, selectedGroups.selectedItems);
  }

  edit(group, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.router.push(`${this.props.params.fqon}/groups/${group.id}/edit`);
    }
  }

  delete() {
    const { params, fetchGroups, deleteGroups, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedGroups;
    const groupIds = selectedItems.map(item => (item.id));
    const groupsNames = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchGroups(params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteGroups(groupIds, params.fqon, onSuccess);
    }, groupsNames);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-group"
        label="Create Group"
        flat
        primary
        component={Link}
        to={`${this.props.params.fqon}/groups/create`}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedGroups;
    const { handleTableSortIcon, sortTable } = this.props;

    const groups = this.props.groups.map(group => (
      <TableRow key={group.id} onClick={e => this.edit(group, e)}>
        <TableColumn>{group.name}</TableColumn>
        <TableColumn>{group.description}</TableColumn>
        <TableColumn><FormattedDate value={group.created.timestamp} /> <FormattedTime value={group.created.timestamp} /></TableColumn>
      </TableRow>
    ));

    // const handleTableSortIcon = (key) => {
    //   if (key === this.props.sortKey) {
    //     return this.props.sortOrder === 'asc';
    //   }

    //   return undefined;
    // };

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={
              <div>
                <div className="gf-headline">Groups</div>
                <div className="md-caption"><Breadcrumbs /></div>
              </div>
            }
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} group${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="groups-listing" /> : null}
          <DataTable baseId="Groups" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.groups.length ? null :
            <TableHeader>
              <TableRow>
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {groups}
            </TableBody>
          </DataTable>
        </Card>
      </div>
    );
  }
}

export default GroupItem;
