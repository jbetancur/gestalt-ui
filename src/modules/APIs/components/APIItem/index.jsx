import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class APIItem extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apis: PropTypes.array.isRequired,
    selectedAPIs: PropTypes.object.isRequired,
    deleteAPIs: PropTypes.func.isRequired,
    apisPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIs: PropTypes.func.isRequired,
    unloadAPIs: PropTypes.func.isRequired,
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
    const { match, fetchAPIs } = this.props;
    fetchAPIs(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadAPIs, clearTableSelected, clearTableSort } = this.props;
    unloadAPIs();
    clearTableSelected();
    clearTableSort();
  }

  handleRowToggle(row, toggled, count) {
    const { apis, handleTableSelected, selectedAPIs } = this.props;

    handleTableSelected(row, toggled, count, apis, selectedAPIs.selectedItems);
  }

  delete() {
    const { match, fetchAPIs, deleteAPIs, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedAPIs;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchAPIs(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteAPIs(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  edit(api, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/${api.id}/edit`);
    }
  }

  renderCreateButton() {
    const { match } = this.props;

    return (
      <Button
        id="create-api"
        label="Create API"
        flat
        primary
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/apis/create`}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedAPIs;
    const { handleTableSortIcon, sortTable } = this.props;

    const apis = this.props.apis.map(api => (
      <TableRow key={api.id} onClick={e => this.edit(api, e)}>
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
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.apisPending ? <LinearProgress id="api-listing" /> : null}
          <DataTable baseId="apis" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.apis.length ? null :
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
