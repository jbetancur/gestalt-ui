import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton, CopyUUIDButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import A from 'components/A';

class LambdaItem extends PureComponent {
  static propTypes = {
    lambdas: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    selectedLambdas: PropTypes.object.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    deleteLambdas: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchLambdas: PropTypes.func.isRequired,
    unloadLambdas: PropTypes.func.isRequired,
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
    const { match, fetchLambdas } = this.props;

    fetchLambdas(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadLambdas, clearTableSelected, clearTableSort } = this.props;
    unloadLambdas();
    clearTableSelected();
    clearTableSort();
  }

  handleRowToggle(row, toggled, count) {
    const { lambdas, handleTableSelected, selectedLambdas } = this.props;

    handleTableSelected(row, toggled, count, lambdas, selectedLambdas.selectedItems);
  }

  delete() {
    const { match, deleteLambdas, clearTableSelected, fetchLambdas } = this.props;
    const { selectedItems } = this.props.selectedLambdas;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearTableSelected();
      fetchLambdas(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteLambdas(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  edit(lambda, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { history, match } = this.props;

      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/lambdas/${lambda.id}/edit`);
    }
  }

  renderCreateButton() {
    const { match } = this.props;

    return (
      <Button
        id="create-lambda"
        label="Create Lambda"
        flat
        primary
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/lambdas/create`}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  renderAPIEndpoints(lambda) {
    return lambda.properties.apiEndpoints.map(endpoint => (
      <div key={endpoint.id} >
        <A href={endpoint.properties.public_url} target="_blank" rel="noopener noreferrer">
          {endpoint.properties.public_url}
        </A>
      </div>
    ));
  }

  render() {
    const { selectedCount } = this.props.selectedLambdas;
    const { handleTableSortIcon, sortTable, match } = this.props;

    const lambdas = this.props.lambdas.map(lambda => (
      <TableRow key={lambda.id} onClick={e => this.edit(lambda, e)}>
        <TableColumn containsButtons>
          <Button
            icon
            tooltipLabel="View Log"
            tooltipPosition="right"
            to={{
              pathname: '/logs',
              search: `?name=${lambda.name}&fqon=${match.params.fqon}&providerId=${lambda.properties.provider.id}&logType=lambda&logId=${lambda.id}`
            }}
            target="_blank"
            component={Link}
          >subject
          </Button>
        </TableColumn>
        <TableColumn>{lambda.name}</TableColumn>
        <TableColumn>{lambda.description}</TableColumn>
        <TableColumn><CopyUUIDButton model={lambda} showUUID={false} /></TableColumn>
        <TableColumn>{this.renderAPIEndpoints(lambda)}</TableColumn>
        <TableColumn>{lambda.properties.runtime}</TableColumn>
        <TableColumn>{lambda.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={lambda.created.timestamp} /> <FormattedTime value={lambda.created.timestamp} /></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Lambdas</div>}
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} lambda${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.lambdaPending && <LinearProgress id="lambda-listing" />}
          <DataTable baseId="Lambdas" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {this.props.lambdas.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn />
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn>UUID</TableColumn>
                <TableColumn>Endpoints</TableColumn>
                <TableColumn sorted={handleTableSortIcon('properties.runtime')} onClick={() => sortTable('properties.runtime')}>Runtime</TableColumn>
                <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {lambdas}
            </TableBody>
          </DataTable>
        </Card>
      </div>
    );
  }
}

export default LambdaItem;

