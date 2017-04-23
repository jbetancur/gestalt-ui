import React, { Component } from 'react';
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
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import { FormattedDate, FormattedTime } from 'react-intl';
import Breadcrumbs from 'modules/Breadcrumbs';
import { DeleteIconButton } from 'components/Buttons';

class GroupItem extends Component {
  static propTypes = {
    fetchGroups: PropTypes.func.isRequired,
    handleSelected: PropTypes.func.isRequired,
    selectedGroups: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    deleteGroups: PropTypes.func.isRequired,
    unloadGroups: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchGroups, params } = this.props;
    fetchGroups(params.fqon);
  }

  componentWillUnmount() {
    const { unloadGroups, clearSelected } = this.props;
    unloadGroups();
    clearSelected();
  }

  handleRowToggle(row, toggled, count) {
    const { groups, handleSelected, selectedGroups } = this.props;

    handleSelected(row, toggled, count, groups, selectedGroups.selectedItems);
  }

  edit(group, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      this.props.router.push(`${this.props.params.fqon}/groups/${group.id}/edit`);
    }
  }

  delete() {
    const { params, fetchGroups, deleteGroups, clearSelected } = this.props;
    const { selectedItems } = this.props.selectedGroups;
    const groupIds = selectedItems.map(item => (item.id));
    const groupsNames = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearSelected();
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
        label="Create Team"
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

    const groups = this.props.groups.map(group => (
      <TableRow key={group.id} onClick={e => this.edit(group, e)}>
        <TableColumn>{group.name}</TableColumn>
        <TableColumn>{group.description}</TableColumn>
        <TableColumn><FormattedDate value={group.created.timestamp} /> <FormattedTime value={group.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={
              <div>
                <div className="gf-headline">Teams</div>
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
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Created</TableColumn>
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
