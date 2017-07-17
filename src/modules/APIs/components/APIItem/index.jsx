import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class APIItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    selectedAPIs: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleRowToggle = this.handleRowToggle.bind(this);
  }

  handleRowToggle(row, toggled, count) {
    const { model, handleTableSelected, selectedAPIs } = this.props;

    handleTableSelected(row, toggled, count, model, selectedAPIs.selectedItems);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-api"
        label="Create API"
        flat
        primary
        onClick={this.props.onCreateToggle}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedAPIs;
    const { handleTableSortIcon, sortTable } = this.props;

    const apis = this.props.model.map(api => (
      <TableRow key={api.id} onClick={e => this.props.onEditToggle(api, e)}>
        <TableColumn>{api.name}</TableColumn>
        <TableColumn>{api.description}</TableColumn>
        <TableColumn>{api.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={api.created.timestamp} /> <FormattedTime value={api.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={<div className="gf-headline">API</div>}
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} API${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending && <LinearProgress id="api-listing" />}
          <DataTable baseId="apis" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {apis}
            </TableBody>
          </DataTable>
        </Card>
      </div>
    );
  }
}

export default APIItem;
