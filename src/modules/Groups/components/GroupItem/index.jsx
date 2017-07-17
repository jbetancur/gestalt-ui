import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Breadcrumbs } from 'modules/ContextManagement';
import { Button, DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class GroupItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    selectedGroups: PropTypes.object.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleRowToggle = this.handleRowToggle.bind(this);
  }

  handleRowToggle(row, toggled, count) {
    const { model, handleTableSelected, selectedGroups } = this.props;

    handleTableSelected(row, toggled, count, model, selectedGroups.selectedItems);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-group"
        label="Create Group"
        flat
        primary
        onClick={this.props.onCreateToggle}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedGroups;
    const { handleTableSortIcon, sortTable } = this.props;

    const groups = this.props.model.map(group => (
      <TableRow key={group.id} onClick={e => this.props.onEditToggle(group, e)}>
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
                <div className="gf-headline">Groups</div>
                <div className="md-caption"><Breadcrumbs /></div>
              </div>
            }
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} group${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="groups-listing" /> : null}
          <DataTable baseId="Groups" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
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
