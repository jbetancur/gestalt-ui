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
import { FormattedDate, FormattedTime } from 'react-intl';

class APIItem extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    apis: PropTypes.array.isRequired,
    selectedAPIs: PropTypes.object.isRequired,
    handleSelected: PropTypes.func.isRequired,
    deleteAPIs: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIs: PropTypes.func.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { params, fetchAPIs } = this.props;
    fetchAPIs(params.fqon, params.environmentId);
  }

  componentWillUnmount() {
    const { onUnloadListing, clearSelected } = this.props;
    onUnloadListing();
    clearSelected();
  }

  handleRowToggle(row, toggled, count) {
    const { apis, handleSelected, selectedAPIs } = this.props;

    handleSelected(row, toggled, count, apis, selectedAPIs.selectedItems);
  }

  delete() {
    const { params, deleteAPIs } = this.props;
    const { selectedItems } = this.props.selectedAPIs;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    this.props.confirmDelete(() => {
      deleteAPIs(IDs, params.fqon, params.environmentId);
    }, names);
  }

  edit(api, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params } = this.props;
      router.push({
        pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/apis/${api.id}/edit`
      });
    }
  }

  renderCreateButton() {
    const { params } = this.props;

    return (
      <Button
        id="create-api"
        label="Create API"
        flat
        component={Link}
        to={{
          pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/apis/create`
        }}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedAPIs;
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
            title="API"
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} API${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<Button onClick={() => this.delete()} style={{ color: 'red' }} icon>delete</Button>]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="api-listing" /> : null}
          <DataTable baseId="apis" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.apis.length ? null :
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Owner</TableColumn>
                <TableColumn>Created</TableColumn>
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
