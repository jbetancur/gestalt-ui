import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import Breadcrumbs from 'modules/Breadcrumbs';
import { Button, DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class ProviderItem extends PureComponent {
  static propTypes = {
    deleteProviders: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    unloadProviders: PropTypes.func.isRequired,
    selectedProviders: PropTypes.object.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    clearTableSelected: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
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
    const entityKey = params.workspaceId && params.environmentId ? 'environments' : 'workspaces';

    fetchProviders(params.fqon, entityId, entityKey);
  }

  componentWillUnmount() {
    const { unloadProviders, clearTableSelected, clearTableSort } = this.props;
    unloadProviders();
    clearTableSelected();
    clearTableSort();
  }

  formatResourceType(resourceType) {
    const split = resourceType.split('::');
    return split[split.length - 1];
  }

  handleRowToggle(row, toggled, count) {
    const { providers, handleTableSelected, selectedProviders } = this.props;

    handleTableSelected(row, toggled, count, providers, selectedProviders.selectedItems);
  }

  create() {
    const { router, params } = this.props;

    // note the workspaceId and environmentId here are passed into the component
    // via the EnvironmentDetail Component they are not props.params
    if (params.workspaceId && !params.environmentId) {
      router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/providers/create` });
    } else if (params.environmentId) {
      router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/providers/create` });
    } else {
      router.push({ pathname: `${params.fqon}/providers/create` });
    }
  }

  edit(provider, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params } = this.props;

      if (params.workspaceId && !params.environmentId) {
        router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/providers/${provider.id}/edit` });
      } else if (params.environmentId) {
        router.push({ pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/providers/${provider.id}/edit` });
      } else {
        router.push({ pathname: `${params.fqon}/providers/${provider.id}/edit` });
      }
    }
  }

  delete() {
    const { params, fetchProviders, deleteProviders, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedProviders;
    const providerIds = selectedItems.map(item => (item.id));
    const providerNames = selectedItems.map(item => (item.name));

    if (params.workspaceId && !params.environmentId) {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(params.fqon, params.workspaceId, 'workspaces');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, params.fqon, params.workspaceId, 'workspaces', onSuccess);
      }, providerNames);
    } else if (params.environmentId) {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(params.fqon, params.environmentId, 'environments');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, params.fqon, params.environmentId, 'environments', onSuccess);
      }, providerNames);
    } else {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(params.fqon);
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, params.fqon, null, null, onSuccess);
      }, providerNames);
    }
  }

  renderCreateButton() {
    return (
      <Button
        id="create-provider"
        label="Create Provider"
        flat
        primary
        onClick={() => this.create()}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedProviders;
    const { handleTableSortIcon, sortTable } = this.props;

    const providers = this.props.providers.map(provider => (
      <TableRow key={provider.id} onClick={e => this.edit(provider, e)}>
        <TableColumn>{provider.name}</TableColumn>
        <TableColumn>{provider.description}</TableColumn>
        <TableColumn>{provider.resource_type && this.formatResourceType(provider.resource_type)}</TableColumn>
        <TableColumn>{provider.properties.parent.name}</TableColumn>
        <TableColumn>{provider.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={provider.created.timestamp} /> <FormattedTime value={provider.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={
              <div>
                <div className="gf-headline">Providers</div>
                {this.props.params.workspaceId ? null : <div className="md-caption"><Breadcrumbs /></div>}
              </div>
            }
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} provider${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="providers-progress" /> : null}
          <DataTable baseId="providers" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.providers.length ? null :
            <TableHeader>
              <TableRow>
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={handleTableSortIcon('resource_type')} onClick={() => sortTable('resource_type')}>Type</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.parent.name')} onClick={() => sortTable('properties.parent.name')}>Parent</TableColumn>
                <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Type</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Type</TableColumn>
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

