import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { withTableManager } from 'Modules/TableManager';
import A from 'components/A';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';
import StatusBubble from 'components/StatusBubble';
import { ClipboardButton } from 'components/Buttons';
import { getLastFromSplit, truncate } from 'util/helpers/strings';
import ActionsModals from '../ActionModals';
import ContainerActions from './ContainerActions';
import ContainerIcon from './ContainerIcon';

// TODO: Sad hack for overflow menus within tables - research fixed option
const TableWrapper = styled.div`
  .md-data-table--responsive {
    padding-bottom: 350px;
    margin-bottom: -350px;
  }
`;

class ContainerItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    getTableSortedItems: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderAPIEndpoints(container) {
    return container.properties.apiEndpoints.map(endpoint => (
      <div key={endpoint.id}>
        <ClipboardButton
          showLabel={false}
          text={endpoint.properties.public_url}
          inLink
        />
        <A href={endpoint.properties.public_url} target="_blank" rel="noopener noreferrer">
          {endpoint.properties.public_url}
        </A>
      </div>
    ));
  }

  render() {
    const { model, tableActions, getTableSortedItems } = this.props;
    const containers = getTableSortedItems(model, 'name').map((container) => {
      const providerType = getLastFromSplit(container.properties.provider.resource_type);

      return (
        <TableRow key={container.id} onClick={e => this.props.onEditToggle(container, e)}>
          <TableColumn>
            <ContainerActions
              containerModel={container}
              {...this.props}
            />
          </TableColumn>
          <TableColumn>
            <StatusBubble status={container.properties.status} />
          </TableColumn>
          <TableColumn>{truncate(container.name, 30)}</TableColumn>
          <TableColumn>{this.renderAPIEndpoints(container)}</TableColumn>
          <TableColumn><ContainerIcon resourceType={providerType} /></TableColumn>
          <TableColumn>{truncate(container.properties.provider.name, 30)}</TableColumn>
          <TableColumn>{truncate(container.properties.image, 20)}</TableColumn>
          <TableColumn>
            {container.properties.instances && `${container.properties.instances.length} / ${container.properties.num_instances}`}
          </TableColumn>
          <TableColumn>{`${container.properties.cpus} / ${container.properties.memory}`}</TableColumn>
          <TableColumnTimestamp timestamp={container.modified.timestamp} />
        </TableRow>
      );
    }
    );

    return (
      <div>
        <ActionsModals />
        <Row gutter={5}>
          <Col component={Card} flex={12} tableCard>
            <TableCardHeader
              title={<div className="gf-headline">Containers</div>}
              visible={false} // TODO: React-md propTypes bug
            />
            {this.props.pending && <LinearProgress id="containers-listing" />}
            {this.props.model.length > 0 &&
            <TableWrapper>
              <DataTable baseId="containers" plain>
                <TableHeader>
                  <TableRow>
                    <TableColumn style={{ width: '100px' }}>Actions</TableColumn>
                    <TableColumn style={{ width: '175px' }} sorted={tableActions.handleTableSortIcon('properties.status')} onClick={() => tableActions.sortTable('properties.status')}>Status</TableColumn>
                    <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
                    <TableColumn>Endpoints</TableColumn>
                    <TableColumn style={{ width: '100px' }}sorted={tableActions.handleTableSortIcon('properties.provider.resource_type')} onClick={() => tableActions.sortTable('properties.provider.resource_type')}>Platform</TableColumn>
                    <TableColumn sorted={tableActions.handleTableSortIcon('properties.provider.name')} onClick={() => tableActions.sortTable('properties.provider.name')}>Provider</TableColumn>
                    <TableColumn style={{ width: '100px' }}>Image</TableColumn>
                    <TableColumn style={{ width: '100px' }}>Instances</TableColumn>
                    <TableColumn style={{ width: '100px' }}>CPU / Memory</TableColumn>
                    <TableColumn style={{ width: '180px' }} sorted={tableActions.handleTableSortIcon('properties.modified.timestamp')} onClick={() => tableActions.sortTable('properties.modified.timestamp')}>Modified</TableColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {containers}
                </TableBody>
              </DataTable>
            </TableWrapper>}
          </Col>
        </Row>
      </div>
    );
  }
}

export default withTableManager(ContainerItem);

