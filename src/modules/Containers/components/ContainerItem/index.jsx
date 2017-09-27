import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import styled from 'styled-components';
import { Col, Row } from 'react-flexybox';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import A from 'components/A';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import { parseChildClass } from 'util/helpers/strings';
import ContainerActions from '../ContainerActions';
import ContainerIcon from '../ContainerIcon';

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
    tableActions: PropTypes.func.isRequired,
    getTableSortedItems: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderAPIEndpoints(container) {
    return container.properties.apiEndpoints.map(endpoint => (
      <div key={endpoint.id} >
        <A href={endpoint.properties.public_url} target="_blank" rel="noopener noreferrer">
          {endpoint.properties.public_url}
        </A>
      </div>
    ));
  }

  render() {
    const { model, tableActions, getTableSortedItems } = this.props;
    const containers = getTableSortedItems(model, 'name').map((container) => {
      const providerType = parseChildClass(container.properties.provider.resource_type);
      return (
        <TableRow key={container.id} onClick={e => this.props.onEditToggle(container, e)}>
          <TableColumn>
            <ContainerActions
              containerModel={container}
              {...this.props}
            />
          </TableColumn>
          <TableColumn>{container.name}</TableColumn>
          <TableColumn>{container.properties.status}</TableColumn>
          <TableColumn>{this.renderAPIEndpoints(container)}</TableColumn>
          <TableColumn><ContainerIcon resourceType={providerType} /></TableColumn>
          <TableColumn>{container.properties.provider.name}</TableColumn>
          <TableColumn numeric>{`${container.properties.instances.length} / ${container.properties.num_instances}`}</TableColumn>
          <TableColumn numeric>{`${container.properties.cpus} / ${container.properties.memory}`}</TableColumn>
          <TableColumn>{!container.properties.age ? null : <FormattedRelative value={container.properties.age} />}</TableColumn>
        </TableRow>
      );
    }
    );

    return (
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
                  <TableColumn />
                  <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('properties.status')} onClick={() => tableActions.sortTable('properties.status')}>Health</TableColumn>
                  <TableColumn>Endpoints</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('properties.provider.resource_type')} onClick={() => tableActions.sortTable('properties.provider.resource_type')}>Platform</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('properties.provider.name')} onClick={() => tableActions.sortTable('properties.provider.name')}>Provider</TableColumn>
                  <TableColumn>Instances</TableColumn>
                  <TableColumn>CPU / Memory</TableColumn>
                  <TableColumn sorted={tableActions.handleTableSortIcon('properties.age')} onClick={() => tableActions.sortTable('properties.age')}>Age</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers}
              </TableBody>
            </DataTable>
          </TableWrapper>}
        </Col>
      </Row>
    );
  }
}

export default ContainerItem;

