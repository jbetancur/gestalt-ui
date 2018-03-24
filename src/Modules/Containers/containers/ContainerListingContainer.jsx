import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withMetaResource } from 'Modules/MetaResource';
import { generateContextEntityState } from 'util/helpers/context';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, Endpoints } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { Card, FontIcon } from 'react-md';
import StatusBubble from 'components/StatusBubble';
import { getLastFromSplit, truncate } from 'util/helpers/strings';
import actions from '../actions';
import ContainerActions from '../components/ContainerActions';
import ContainerIcon from '../components/ContainerIcon';
import ActionsModals from '../ActionModals';

class ContainerListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    containersPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    fetchContainers: PropTypes.func.isRequired,
    unloadContainers: PropTypes.func.isRequired,
    fetchActions: PropTypes.func.isRequired,
    providerContext: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    providerContext: false,
  };

  componentDidMount() {
    const { fetchActions, match } = this.props;
    const entity = generateContextEntityState(match.params);

    this.init();
    fetchActions(match.params.fqon, entity.id, entity.key, { filter: 'container.detail' });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.containers !== nextProps.containers) {
      clearTimeout(this.timeout);

      if (!nextProps.containersPending) {
        this.startPoll();
      }
    }
  }

  componentWillUnmount() {
    this.props.unloadContainers();
    clearTimeout(this.timeout);
  }

  startPoll() {
    this.timeout = setInterval(() => this.init(true), 5000);
  }

  init(isPolling) {
    const { match, fetchContainers } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchContainers(match.params.fqon, entity.id, entity.key, isPolling);
  }

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
  }

  render() {
    const columns = [
      {
        width: '42px',
        ignoreRowClick: true,
        cell: row => (
          <ContainerActions
            containerModel={row}
            editURL={`${this.props.match.url}/${row.id}`}
            {...this.props}
          />
        )
      },
      {
        name: 'Status',
        selector: 'properties.status',
        sortable: true,
        width: '100px',
        center: true,
        cell: row => <StatusBubble status={row.properties.status} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        compact: true,
        cell: row => <Name name={row.name} description={row.description} />
      },
      {
        name: 'Endpoints',
        selector: 'properties.apiEndpoints',
        ignoreRowClick: true,
        cell: row => <Endpoints endpoints={row.properties.apiEndpoints} />
      },
      {
        name: 'Provider',
        selector: 'properties.provider.name',
        sortable: true,
        format: row => truncate(row.properties.provider.name, 30),
      },
      {
        name: 'Image',
        selector: 'properties.image',
        sortable: true,
        format: row => truncate(row.properties.image, 30),
      },
      {
        name: 'Platform',
        selector: 'properties.provider.resource_type',
        sortable: true,
        center: true,
        width: '42px',
        cell: row => <ContainerIcon resourceType={getLastFromSplit(row.properties.provider.resource_type)} />
      },
      {
        name: 'Instances',
        selector: 'properties.num_instances',
        sortable: true,
        number: true,
        width: '42px',
        cell: row => <div>{row.properties.instances && `${row.properties.instances.length} / ${row.properties.num_instances}`}</div>
      },
      {
        name: 'CPU',
        selector: 'properties.cpus',
        sortable: true,
        number: true,
        width: '42px',
      },
      {
        name: 'Mem (MiB)',
        selector: 'properties.memory',
        sortable: true,
        number: true,
        width: '42px',
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        width: '158px',
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
    ];

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <ActionsModals />
          <DataTable
            title="Containers"
            data={this.props.containers}
            highlightOnHover
            pointerOnHover
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.containersPending}
            progressComponent={<LinearProgress id="container-listing" />}
            columns={columns}
            noDataComponent="There are no containers to display"
            onRowClicked={this.handleRowClicked}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withMetaResource,
  withRouter,
  connect(null, actions),
)(ContainerListing);
