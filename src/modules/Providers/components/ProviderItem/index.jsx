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
// import { toggleHandler } from 'util/helpers/lists';

class ProviderItem extends Component {
  static propTypes = {
    deleteProviders: PropTypes.func.isRequired,
    handleSelected: PropTypes.func.isRequired,
    selectedProviders: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    workspaceId: PropTypes.string,
    environmentId: PropTypes.string
  };

  static defaultProps = {
    workspaceId: null,
    environmentId: null
  };

  constructor(props) {
    super(props);
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
    const { router, params, workspaceId, environmentId } = this.props;

    // note the workspaceId and environmentId here are passed into the component
    // via the EnvironmentDetail Component they are not props.params
    if (workspaceId) {
      router.push(`${params.fqon}/workspaces/${workspaceId}/providers/create`);
    } else if (environmentId) {
      router.push(`${params.fqon}/workspaces/${params.workspaceId}/environments/${environmentId}/providers/create?tabIndex=4`);
    } else {
      router.push(`${params.fqon}/providers/create`);
    }
  }

  edit(provider, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params, workspaceId, environmentId } = this.props;

      if (workspaceId) {
        router.push(`${params.fqon}/workspaces/${workspaceId}/providers/${provider.id}/edit`);
      } else if (environmentId) {
        router.push(`${params.fqon}/workspaces/${params.workspaceId}/environments/${environmentId}/providers/${provider.id}/edit?tabIndex=4`);
      } else {
        router.push(`${params.fqon}/providers/${provider.id}/edit`);
      }
    }
  }

  delete() {
    const { params, deleteProviders, workspaceId, environmentId } = this.props;
    const { selectedItems } = this.props.selectedProviders;
    const providerIds = selectedItems.map(item => (item.id));

    if (workspaceId) {
      deleteProviders(providerIds, params.fqon, workspaceId, 'workspaces');
    } else if (environmentId) {
      deleteProviders(providerIds, params.fqon, environmentId, 'environments');
    } else {
      deleteProviders(providerIds, params.fqon);
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
          {this.props.pending ? <LinearProgress id="providers-progress" scale={3} centered={true} /> :
          <DataTable baseId="providers" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Parent</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default ProviderItem;

