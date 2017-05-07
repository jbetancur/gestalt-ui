import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import styled from 'styled-components';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import A from 'components/A';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import ContainerActions from '../ContainerActions';

// TODO: Sad hack for overflow menus within tables - research fixed option
const TableWrapper = styled.div`
  .md-data-table--responsive {
    padding-bottom: 250px;
    margin-bottom: -250px;
  }
`;

class ContainerItem extends PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    fetchContainers: PropTypes.func.isRequired,
    unloadContainers: PropTypes.func.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    clearTableSort: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.containers !== nextProps.containers) {
      clearTimeout(this.timeout);

      if (!nextProps.pending) {
        this.startPoll();
      }
    }
  }

  componentWillUnmount() {
    this.props.unloadContainers();
    this.props.clearTableSort();
    clearTimeout(this.timeout);
  }

  startPoll() {
    this.timeout = setTimeout(() => this.init(true), 5000);
  }

  init(isPolling) {
    const { params, fetchContainers } = this.props;
    fetchContainers(params.fqon, params.environmentId, isPolling);
  }

  edit(container, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params } = this.props;
      router.push({
        pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/containers/${container.id}/edit`
      });
    }
  }

  renderCreateButton() {
    const { params } = this.props;

    return (
      <Button
        id="create-container"
        label="Deploy Container"
        flat
        primary
        component={Link}
        to={{
          pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/containers/create`
        }}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
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
    const { handleTableSortIcon, sortTable } = this.props;

    const containers = this.props.containers.map(container => (
      <TableRow key={container.id} onClick={e => this.edit(container, e)} expandable>
        <TableColumn containsButtons>
          <ContainerActions container={container} {...this.props} />
          {/* <Button
            icon
            tooltipLabel="Logs"
            to={`containers/${container.id}/logs`}
            target="_blank"
            component={Link}
          >subject
        </Button> */}
        </TableColumn>
        <TableColumn>{container.name}</TableColumn>
        <TableColumn>{container.properties.status}</TableColumn>
        <TableColumn>{this.renderAPIEndpoints(container)}</TableColumn>
        <TableColumn>{container.properties.provider.name}</TableColumn>
        <TableColumn numeric>{`${container.properties.instances.length} / ${container.properties.num_instances}`}</TableColumn>
        <TableColumn numeric>{`${container.properties.cpus} / ${container.properties.memory}`}</TableColumn>
        <TableColumn>{!container.properties.age ? null : <FormattedRelative value={container.properties.age} />}</TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Containers</div>}
            visible={false} // TODO: React-md propTypes bug
          >
            <div>
              {this.renderCreateButton()}
            </div>
          </TableCardHeader>
          {this.props.pending && <LinearProgress id="containers-listing" />}
          {!this.props.containers.length ? null :
          <TableWrapper>
            <DataTable baseId="containers" plain>
              <TableHeader>
                <TableRow>
                  <TableColumn />
                  <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                  <TableColumn sorted={handleTableSortIcon('properties.status')} onClick={() => sortTable('properties.status')}>Status</TableColumn>
                  <TableColumn>Endpoints</TableColumn>
                  <TableColumn sorted={handleTableSortIcon('properties.provider.name')} onClick={() => sortTable('properties.provider.name')}>Provider</TableColumn>
                  <TableColumn>Instances</TableColumn>
                  <TableColumn>CPU / Memory</TableColumn>
                  <TableColumn sorted={handleTableSortIcon('properties.age')} onClick={() => sortTable('properties.age')}>Age</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers}
              </TableBody>
            </DataTable>
          </TableWrapper>}
        </Card>
      </div>
    );
  }
}

export default ContainerItem;

