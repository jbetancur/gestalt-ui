import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Breadcrumbs } from 'modules/ContextManagement';
import { Button, DeleteIconButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import { parseChildClass } from 'util/helpers/strings';

class ProviderItem extends PureComponent {
  static propTypes = {
    deleteProviders: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    providersPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
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
    const { match, fetchProviders } = this.props;
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.environmentId ? 'environments' : 'workspaces';

    fetchProviders(match.params.fqon, entityId, entityKey);
  }

  componentWillUnmount() {
    const { unloadProviders, clearTableSelected, clearTableSort } = this.props;
    unloadProviders();
    clearTableSelected();
    clearTableSort();
  }

  handleRowToggle(row, toggled, count) {
    const { providers, handleTableSelected, selectedProviders } = this.props;

    handleTableSelected(row, toggled, count, providers, selectedProviders.selectedItems);
  }

  create() {
    const { history, match } = this.props;

    // note the workspaceId and environmentId here are passed into the component
    // via the EnvironmentDetail Component they are not props.match
    if (match.params.workspaceId && !match.params.environmentId) {
      history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers/create` });
    } else if (match.params.environmentId) {
      history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/providers/create` });
    } else {
      history.push({ pathname: `/${match.params.fqon}/providers/create` });
    }
  }

  edit(provider, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;

      if (match.params.workspaceId && !match.params.environmentId) {
        history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers/${provider.id}/edit` });
      } else if (match.params.environmentId) {
        history.push({ pathname: `/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/providers/${provider.id}/edit` });
      } else {
        history.push({ pathname: `/${match.params.fqon}/providers/${provider.id}/edit` });
      }
    }
  }

  delete() {
    const { match, fetchProviders, deleteProviders, clearTableSelected } = this.props;
    const { selectedItems } = this.props.selectedProviders;
    const providerIds = selectedItems.map(item => (item.id));
    const providerNames = selectedItems.map(item => (item.name));

    if (match.params.workspaceId && !match.params.environmentId) {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(match.params.fqon, match.params.workspaceId, 'workspaces');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, match.params.workspaceId, 'workspaces', onSuccess);
      }, providerNames);
    } else if (match.params.environmentId) {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(match.params.fqon, match.params.environmentId, 'environments');
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, match.params.environmentId, 'environments', onSuccess);
      }, providerNames);
    } else {
      const onSuccess = () => {
        clearTableSelected();
        fetchProviders(match.params.fqon);
      };

      this.props.confirmDelete(() => {
        deleteProviders(providerIds, match.params.fqon, null, null, onSuccess);
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
        <TableColumn>{provider.resource_type && parseChildClass(provider.resource_type)}</TableColumn>
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
                {this.props.match.params.workspaceId ? null : <div className="md-caption"><Breadcrumbs /></div>}
              </div>
            }
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} provider${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.providersPending && <LinearProgress id="providers-progress" />}
          <DataTable baseId="providers" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {this.props.providers.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={handleTableSortIcon('resource_type')} onClick={() => sortTable('resource_type')}>Type</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.parent.name')} onClick={() => sortTable('properties.parent.name')}>Parent</TableColumn>
                <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
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

