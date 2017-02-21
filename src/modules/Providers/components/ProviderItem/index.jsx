import React, { Component, PropTypes } from 'react';
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
import { FormattedDate } from 'react-intl';

class ProviderItem extends Component {
  static propTypes = {
    deleteProviders: PropTypes.func.isRequired,
    handleSelected: PropTypes.func.isRequired,
    selectedProviders: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
    organization: PropTypes.object,
    workspace: PropTypes.object,
    environment: PropTypes.object,
  };

  static defaultProps = {
    organization: {},
    workspace: {},
    environment: {},
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { params, fetchProviders } = this.props;
    const entityId = params.environmentId || params.workspaceId || null;
    const entityKey = params.workspaceId ? 'workspaces' : 'environments';
    fetchProviders(params.fqon, entityId, entityKey);
  }

  componentWillUnmount() {
    const { onUnloadListing, clearSelected } = this.props;
    onUnloadListing();
    clearSelected();
  }

  formatResourceType(resourceType) {
    const split = resourceType.split('::');
    return split[split.length - 1];
  }

  handleRowToggle(row, toggled, count) {
    const { providers, handleSelected, selectedProviders } = this.props;

    handleSelected(row, toggled, count, providers, selectedProviders.selectedItems);
  }

  create() {
    const { router, params, organization, environment, workspace } = this.props;

    // note the workspaceId and environmentId here are passed into the component
    // via the EnvironmentDetail Component they are not props.params
    if (params.workspaceId && !params.environmentId) {
      router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/providers/create`, state: { workspace } });
    } else if (params.environmentId) {
      router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/providers/create`, state: { environment } });
    } else {
      router.push({ pathname: `${params.fqon}/providers/create`, state: { organization } });
    }
  }

  edit(provider, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params, organization, environment, workspace } = this.props;

      if (params.workspaceId && !params.environmentId) {
        router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/providers/${provider.id}/edit`, state: { workspace } });
      } else if (params.environmentId) {
        router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/providers/${provider.id}/edit`, state: { environment } });
      } else {
        router.push({ pathname: `${params.fqon}/providers/${provider.id}/edit`, state: { organization } });
      }
    }
  }

  delete() {
    const { params, deleteProviders } = this.props;
    const { selectedItems } = this.props.selectedProviders;
    const providerIds = selectedItems.map(item => (item.id));
    const providerNames = selectedItems.map(item => (item.name));

    if (params.workspaceId) {
      this.props.confirmDelete(() => {
        deleteProviders(providerIds, params.fqon, params.workspaceId, 'workspaces');
      }, providerNames);
    } else if (params.environmentId) {
      this.props.confirmDelete(() => {
        deleteProviders(providerIds, params.fqon, params.environmentId, 'environments');
      }, providerNames);
    } else {
      this.props.confirmDelete(() => {
        deleteProviders(providerIds, params.fqon);
      }, providerNames);
    }
  }

  renderCreateButton() {
    return (
      <Button
        id="create-provider"
        label="Create Provider"
        flat
        onClick={() => this.create()}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedProviders;

    const providers = this.props.providers.map(provider => (
      <TableRow key={provider.id} onClick={e => this.edit(provider, e)}>
        <TableColumn>{provider.name}</TableColumn>
        <TableColumn>{provider.description}</TableColumn>
        <TableColumn>{this.formatResourceType(provider.resource_type)}</TableColumn>
        <TableColumn>{provider.properties.parent.name}</TableColumn>
        <TableColumn><FormattedDate value={provider.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Providers"
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} provider${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<Button onClick={() => this.delete()} style={{ color: 'red' }} icon>delete</Button>]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="providers-progress" /> : null}
          <DataTable baseId="providers" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.providers.length ? null :
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Parent</TableColumn>
                <TableColumn>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {providers}
            </TableBody>
          </DataTable>
        </Card>
      </div>
    );
  }
}

export default ProviderItem;

