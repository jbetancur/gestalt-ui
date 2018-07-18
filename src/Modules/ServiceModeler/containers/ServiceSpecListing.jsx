import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, NoData, GenericMenuActions } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { ServiceIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { FontIcon } from 'react-md';
import { withServiceSpecs } from 'Modules/MetaResource';
import actions from '../actions';

class ServiceSpecListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    serviceSpecs: PropTypes.array.isRequired,
    serviceSpecsPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    serviceSpecsActions: PropTypes.object.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, serviceSpecsActions } = this.props;

    serviceSpecsActions.fetchServiceSpecs({ fqon: match.params.fqon });
  }

  deleteOne = (row) => {
    const { match, serviceSpecsActions } = this.props;

    const onSuccess = () => {
      serviceSpecsActions.fetchServiceSpecs({ fqon: match.params.fqon });
    };

    this.props.confirmDelete(({ force }) => {
      serviceSpecsActions.deleteServiceSpec({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } });
    }, `Are you sure you want to delete ${row.name}?`);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  defineContextActions() {
    return [
      <DeleteIconButton key="delete-items" onClick={this.deleteMultiple} />,
    ];
  }

  defineColumns() {
    return [
      {
        width: '56px',
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            // editURL={`${this.props.match.url}/${row.id}`}
            entityKey="servicespecs"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 3,
        cell: row => <Name maxWidth="500px" name={row.name} description={row.description} to={`${this.props.match.url}/${row.id}`} />
      },
      {
        name: 'Owner',
        selector: 'owner.name',
        sortable: true,
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
      {
        name: 'Modified',
        selector: 'modified.timestamp',
        sortable: true,
        cell: row => <Timestamp timestamp={row.modified.timestamp} />
      },
    ];
  }

  render() {
    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="Service Specifications"
            data={this.props.serviceSpecs}
            highlightOnHover
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.serviceSpecsPending}
            progressComponent={<LinearProgress id="servicespecs-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no service specifications to display" icon={<ServiceIcon size={150} />} />}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withServiceSpecs,
  connect(null, actions),
)(ServiceSpecListing);
