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
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    onToggleInstanceModal: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    model: PropTypes.array.isRequired,
    providersPending: PropTypes.bool.isRequired,
    selectedProviders: PropTypes.object.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
    self: PropTypes.object.isRequired,
  };

  static defaultProps = {
    organization: {},
    workspace: {},
    environment: {},
  }

  constructor(props) {
    super(props);

    this.handleRowToggle = this.handleRowToggle.bind(this);
  }

  handleRowToggle(row, toggled, count) {
    const { model, handleTableSelected, selectedProviders } = this.props;

    handleTableSelected(row, toggled, count, model, selectedProviders.selectedItems);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-provider"
        label="Create Provider"
        flat
        primary
        onClick={this.props.onCreateToggle}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  renderCreateInstanceButton() {
    return (
      this.props.self.name === 'gfdemo' &&
        <Button
          id="create-provider-instance"
          label="Create Provider Instance"
          flat
          primary
          onClick={this.props.onToggleInstanceModal}
        >
          <FontIcon>add</FontIcon>
        </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedProviders;
    const { handleTableSortIcon, sortTable } = this.props;

    const providers = this.props.model.map(provider => (
      <TableRow key={provider.id} onClick={e => this.props.onEditToggle(provider, e)}>
        <TableColumn>{provider.name}</TableColumn>
        <TableColumn>{provider.description}</TableColumn>
        <TableColumn>{provider.resource_type && parseChildClass(provider.resource_type)}</TableColumn>
        <TableColumn>{provider.properties.parent.name}</TableColumn>
        <TableColumn>{provider.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={provider.created.timestamp} /> <FormattedTime value={provider.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div>
        <div className="flex-row">
          <Card className="flex-12" tableCard>
            <TableCardHeader
              title={
                <div>
                  <div className="gf-headline">Providers</div>
                  {!this.props.match.params.workspaceId && <div className="md-caption"><Breadcrumbs /></div>}
                </div>
              }
              visible={selectedCount > 0}
              contextualTitle={`${selectedCount} provider${selectedCount > 1 ? 's' : ''} selected`}
              actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
            >
              <div>{this.renderCreateButton()}</div>
              <div>{this.renderCreateInstanceButton()}</div>
            </TableCardHeader>
            {this.props.providersPending && <LinearProgress id="providers-progress" />}
            <DataTable baseId="providers" onRowToggle={this.handleRowToggle}>
              {this.props.model.length > 0 &&
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
      </div>
    );
  }
}

export default ProviderItem;

