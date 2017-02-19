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

const EnhancedTableColumn = styled(TableColumn)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 3.8em;
  vertical-align: middle !important;
`;

class ContainerItem extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired,
    fetchContainers: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  refresh() {
    const fqon = this.props.fqon || this.props.params.fqon;
    const environmentId = this.props.environmentId || this.props.params.environmentId;
    this.props.fetchContainers(fqon, environmentId);
  }

  edit(container, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params, } = this.props;

      router.push(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/containers/${container.id}/edit`);
    }
  }

  renderCreateButton() {
    const { fqon, environmentId, params } = this.props;

    return (
      <Button
        id="create-container"
        label="Deploy Container"
        flat
        component={Link}
        to={`${fqon}/workspaces/${params.workspaceId}/environments/${environmentId}/containers/create`}
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
          <ContainerActions state={container.properties.status} container={container} {...this.props} />
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
          >
            <div>
              {this.renderCreateButton()}
            </div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="containers-listing" /> : null}
          {!this.props.containers.length ? null :
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
                <TableColumn>Age</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default ContainerItem;

