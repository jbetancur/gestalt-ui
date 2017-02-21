import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import TimeAgo from 'react-timeago';
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

class ContainerItem extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    environment: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    fetchContainers: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init();
  }

  refresh() {
    this.init();
  }

  init() {
    const { params, fetchContainers } = this.props;
    fetchContainers(params.fqon, params.environmentId);
  }

  edit(container, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params, environment } = this.props;
      router.push({
        pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/containers/${container.id}/edit`,
        state: {
          environment,
        },
      });
    }
  }

  renderCreateButton() {
    const { params, environment } = this.props;

    return (
      <Button
        id="create-container"
        label="Deploy Container"
        flat
        component={Link}
        to={{
          pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/containers/create`,
          state: {
            environment,
          },
        }}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  renderRefreshButton() {
    return <Button onClick={() => this.refresh()} icon primary>refresh</Button>;
  }

  render() {
    const containers = this.props.containers.map(container => (
      <TableRow key={container.id} onClick={e => this.edit(container, e)}>
        <EnhancedTableColumn>
          <ContainerActions container={container} {...this.props} />
        </EnhancedTableColumn>
        <EnhancedTableColumn>{container.name}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.description}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.status}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.provider.name}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.num_instances}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.cpus}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.memory}</EnhancedTableColumn>
        <EnhancedTableColumn>{container.properties.container_type}</EnhancedTableColumn>
        <EnhancedTableColumn>{!container.properties.age ? null : <TimeAgo date={container.properties.age} />}</EnhancedTableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={<span style={{ lineHeight: '2em' }}>Containers <span>{this.renderRefreshButton()}</span></span>}
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
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Description</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Provider</TableColumn>
                  <TableColumn>Instances</TableColumn>
                  <TableColumn>CPU</TableColumn>
                  <TableColumn>Memory</TableColumn>
                  <TableColumn>Type</TableColumn>
                  <TableColumn>Modified</TableColumn>
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

