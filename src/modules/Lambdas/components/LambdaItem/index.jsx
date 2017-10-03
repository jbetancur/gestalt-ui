import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { ActionsMenu } from 'modules/Actions';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton, ClipboardButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import A from 'components/A';
import { truncate } from 'util/helpers/strings';

// TODO: Sad hack for overflow menus within tables - research fixed option
const TableWrapper = styled.div`
.md-data-table--responsive {
  padding-bottom: 250px;
  margin-bottom: -250px;
}
`;

class LambdaItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    actions: PropTypes.array.isRequired,
    actionsPending: PropTypes.bool.isRequired,
    getTableSortedItems: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleRowToggle = (row, toggled, count) => {
    const { model, tableActions, tableManager } = this.props;

    tableActions.handleTableSelected(row, toggled, count, model, tableManager.tableSelected.items);
  }

  renderAPIEndpoints(lambda) {
    return lambda.properties.apiEndpoints.map(endpoint => (
      <div key={endpoint.id} >
        <A href={endpoint.properties.public_url} bubble target="_blank" rel="noopener noreferrer">
          {endpoint.properties.public_url}
        </A>
      </div>
    ));
  }

  render() {
    const { count } = this.props.tableManager.tableSelected;
    const { model, tableActions, getTableSortedItems, match, actions, actionsPending } = this.props;
    const lambdas = getTableSortedItems(model, 'name').map(lambda => (
      <TableRow key={lambda.id} onClick={e => this.props.onEditToggle(lambda, e)}>
        <TableColumn>
          <ClipboardButton
            text={lambda.id}
            showUUID={false}
            tooltipLabel="Copy uuid to clipboard"
          />
          <ActionsMenu
            icon
            model={lambda}
            actionList={actions}
            pending={actionsPending}
          />
          <Button
            icon
            iconChildren="subject"
            tooltipLabel="View Log"
            tooltipPosition="bottom"
            to={{
              pathname: '/logs',
              search: `?name=${lambda.name}&fqon=${match.params.fqon}&providerId=${lambda.properties.provider.id}&logType=lambda&logId=${lambda.id}`
            }}
            target="_blank"
            component={Link}
          />
        </TableColumn>
        <TableColumn>{lambda.name}</TableColumn>
        <TableColumn>{truncate(lambda.description, 45)}</TableColumn>
        <TableColumn>{this.renderAPIEndpoints(lambda)}</TableColumn>
        <TableColumn>{lambda.properties.runtime}</TableColumn>
        <TableColumn>{lambda.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={lambda.created.timestamp} /> <FormattedTime value={lambda.created.timestamp} /></TableColumn>
      </TableRow>
    ));

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12} tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Lambdas</div>}
            visible={count > 0}
            contextualTitle={`${count} lambda${count > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          />
          {this.props.pending && <LinearProgress id="lambda-listing" />}
          <TableWrapper>
            <DataTable baseId="Lambdas" onRowToggle={this.handleRowToggle}>
              {this.props.model.length > 0 &&
              <TableHeader>
                <TableRow>
                  <TableColumn style={{ width: '16px' }} />
                  <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('description')} onClick={() => tableActions.sortTable('description')}>Description</TableColumn>
                  <TableColumn>Endpoints</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('properties.runtime')} onClick={() => tableActions.sortTable('properties.runtime')}>Runtime</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('owner.name')} onClick={() => tableActions.sortTable('owner.name')}>Owner</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('created.timestamp')} onClick={() => tableActions.sortTable('created.timestamp')}>Created</TableColumn>
                </TableRow>
              </TableHeader>}
              <TableBody>
                {lambdas}
              </TableBody>
            </DataTable>
          </TableWrapper>
        </Col>
      </Row>
    );
  }
}

export default LambdaItem;

