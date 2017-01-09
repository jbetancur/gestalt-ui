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
import { toggleHandler } from 'util/helpers/lists';

class ProviderItem extends Component {
  static propTypes = {
    deleteProvider: PropTypes.func.isRequired,
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

    this.state = {
      count: 0,
      selectedItems: [],
      title: true
    };
  }

  formatResourceType(resourceType) {
    const split = resourceType.split('::');
    return split[split.length - 1];
  }

  handleRowToggle(row, toggled, count) {
    const { providers } = this.props;

    this.setState({
      count,
      selectedItems: toggleHandler(row, toggled, count, this.state.selectedItems, providers)
    });
  }

  clearSelectedRows() {
    this.setState({
      count: 0,
      selectedItems: [],
      title: true
    });
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
    const { params, deleteProvider } = this.props;
    const { selectedItems } = this.state;

    selectedItems.forEach((item) => {
      deleteProvider(params.fqon, item.id);
    });

    this.clearSelectedRows();
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
    const { count, title } = this.state;

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
            title={title ? 'Providers' : null}
            visible={count > 0}
            contextualTitle={`${count} provider${count > 1 ? 's' : ''} selected`}
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

