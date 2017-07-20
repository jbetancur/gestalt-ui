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
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    selectedLambdas: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleRowToggle = this.handleRowToggle.bind(this);
  }

  handleRowToggle(row, toggled, count) {
    const { model, handleTableSelected, selectedLambdas } = this.props;

    handleTableSelected(row, toggled, count, model, selectedLambdas.selectedItems);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-lambda"
        label="Create Lambda"
        flat
        primary
        onClick={this.props.onCreateToggle}
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

    const lambdas = this.props.model.map(lambda => (
      <TableRow key={lambda.id} onClick={e => this.props.onEditToggle(lambda, e)}>
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
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          >
            {/* <div><Button flat label="Promote" /></div> */}
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending && <LinearProgress id="lambda-listing" />}
          <DataTable baseId="Lambdas" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
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

