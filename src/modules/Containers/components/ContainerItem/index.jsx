import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import styled from 'styled-components';
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
import A from 'components/A';
import ContainerActions from '../ContainerActions';

// TODO: Sad hack for overflow menus within tables - research fixed option
const TableWrapper = styled.div`
  .md-data-table--responsive {
    padding-bottom: 250px;
    margin-bottom: -250px;
  }
`;

const EnhancedTableColumn = styled(TableColumn)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 3.8em;
  vertical-align: middle !important;
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
      <TableRow key={container.id} onClick={e => this.edit(container, e)}>
        <EnhancedTableColumn>
          <ContainerActions container={container} {...this.props} />
        </EnhancedTableColumn>
        <EnhancedTableColumn>{container.name}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.status}</EnhancedTableColumn>
        <EnhancedTableColumn>{this.renderAPIEndpoints(container)}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.provider.name}</EnhancedTableColumn>
        <EnhancedTableColumn numeric>{`${container.properties.instances.length} / ${container.properties.num_instances}`}</EnhancedTableColumn>
        <EnhancedTableColumn numeric>{`${container.properties.cpus} / ${container.properties.memory}`}</EnhancedTableColumn>
        <EnhancedTableColumn>{!container.properties.age ? null : <FormattedRelative value={container.properties.age} />}</EnhancedTableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Containers"
            visible={false} // TODO: React-md propTypes bug
          >
            <div>
              {this.renderCreateButton()}
            </div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="containers-listing" /> : null}
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

