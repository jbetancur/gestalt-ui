import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withPickerData } from 'Modules/MetaResource';
import { generateContextEntityState } from 'util/helpers/context';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, Endpoints, NoData } from 'components/TableCells';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { LinearProgress } from 'components/ProgressIndicators';
import { Card } from 'components/Cards';
import { FontIcon } from 'react-md';
import { StatusBubble } from 'components/Status';
import { ContainerIcon as CIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import { getLastFromSplit, truncate } from 'util/helpers/strings';
import actions from '../actions';
import ContainerActions from '../components/ContainerActions';
import iconMap from '../../Providers/config/iconMap';
import withContainers from '../hocs/withContainers';
import { getContainers } from '../reducers/selectors';

const tableTheme = {
  rows: {
    fontSize: '12px',
  }
};

class ContainerListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    containers: PropTypes.array.isRequired,
    containersPending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    containersActions: PropTypes.object.isRequired,
    providerContext: PropTypes.bool,
    showImportModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    providerContext: false,
  };

  componentDidMount() {
    const { match, containersActions } = this.props;
    const entity = generateContextEntityState(match.params);

    containersActions.fetchContainers({
      fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key, params: { embed: 'apiendpoints' }, enablePolling: true
    });
  }

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
  }

  defineColumns() {
    return [
      {
        width: '56px',
        button: true,
        allowOverflow: true,
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
        allowOverflow: true,
        minWidth: '140px',
        cell: row => (
          <StatusBubble
            status={row.properties.status}
            statusDetail={row.properties.status_detail}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
        cell: row => <Name name={row.name} description={row.description} />
      },
      {
        name: 'Endpoints',
        selector: 'properties.apiendpoints',
        ignoreRowClick: true,
        grow: 2,
        cell: row => <Endpoints endpoints={row.properties.apiendpoints} />
      },
      {
        name: 'Provider',
        selector: 'properties.provider.name',
        sortable: true,
        minWidth: '50px',
        format: row => truncate(row.properties.provider.name, 30),
      },
      {
        name: 'Image',
        selector: 'properties.image',
        sortable: true,
        minWidth: '50px',
        format: row => truncate(row.properties.image, 25),
      },
      {
        name: 'Platform',
        selector: 'properties.provider.resource_type',
        sortable: true,
        center: true,
        compact: true,
        width: '60px',
        cell: row => iconMap(getLastFromSplit(row.properties.provider.resource_type)),
      },
      {
        name: 'Instances',
        selector: 'properties.num_instances',
        sortable: true,
        right: true,
        compact: true,
        grow: 0,
        minWidth: '80px',
        cell: row => <div>{row.properties.instances && `${row.properties.instances.length} / ${row.properties.num_instances}`}</div>
      },
      {
        name: 'CPU',
        selector: 'properties.cpus',
        sortable: true,
        right: true,
        compact: true,
        grow: 0,
        minWidth: '50px',
      },
      {
        name: 'Mem',
        selector: 'properties.memory',
        sortable: true,
        right: true,
        compact: true,
        grow: 0,
        minWidth: '50px',
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        allowOverflow: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
    ];
  }

  render() {
    return (
      <Row gutter={5}>
        <Col flex={12}>
          <Card>
            <DataTable
              title="Containers"
              customTheme={tableTheme}
              data={this.props.containers}
              highlightOnHover
              pointerOnHover
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              progressPending={this.props.containersPending}
              progressComponent={<LinearProgress id="container-listing" />}
              columns={this.defineColumns()}
              noDataComponent={<NoData message="There are no containers to display" icon={<CIcon size={150} />} />}
              onRowClicked={this.handleRowClicked}
              actions={
                <React.Fragment>
                  <SelectFilter disabled={this.props.containersPending} />
                  <Button flat primary onClick={() => this.props.showImportModal({ ...this.props })}>Import</Button>
                </React.Fragment>
              }
              pagination
              paginationPerPage={15}
              // expandableRowsComponent={<ContainerListingExpandable />}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  containers: listSelectors.filterItems()(state, getContainers),
});

export default compose(
  withContainers(),
  withRouter,
  connect(mapStateToProps, actions),
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
)(ContainerListing);
