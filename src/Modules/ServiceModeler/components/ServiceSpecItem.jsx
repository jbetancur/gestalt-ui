import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from 'react-md';
import { DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';
import { truncate } from 'util/helpers/strings';
import { withTableManager } from 'Modules/TableManager';

class ResourceTypeItem extends Component {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    getTableSortedItems: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleRowToggle = (row, toggled, count) => {
    const { model, tableActions, tableManager } = this.props;

    tableActions.handleTableSelected(row, toggled, count, model, tableManager.tableSelected.items);
  }

  render() {
    const { count } = this.props.tableManager.tableSelected;
    const { model, getTableSortedItems } = this.props;
    const resourceTypes = getTableSortedItems(model, 'name').map(resourceType => (
      <TableRow key={resourceType.id} onClick={e => this.props.onEditToggle(resourceType, e)}>
        <TableColumn>{resourceType.name}</TableColumn>
        <TableColumn>{truncate(resourceType.description, 45)}</TableColumn>
        <TableColumnTimestamp timestamp={resourceType.created.timestamp} />
        <TableColumnTimestamp timestamp={resourceType.modified.timestamp} />
      </TableRow>
    ));

    return (
      <div>
        <TableCardHeader
          title="Service Specifications"
          visible={count > 0}
          contextualTitle={`${count} Resource Type${count > 1 ? 's' : ''} selected`}
          actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
        />
        {this.props.pending && <LinearProgress id="resourceType-listing" />}
        <DataTable baseId="resourceTypes" onRowToggle={this.handleRowToggle}>
          {this.props.model.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn>Name</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Created</TableColumn>
              <TableColumn>Modified</TableColumn>
            </TableRow>
          </TableHeader>}
          <TableBody>
            {resourceTypes}
          </TableBody>
        </DataTable>
      </div>
    );
  }
}

export default withTableManager(ResourceTypeItem);

