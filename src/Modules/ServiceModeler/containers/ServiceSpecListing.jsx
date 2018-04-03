import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { ServiceIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';

class PolicyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    serviceSpecs: PropTypes.array.isRequired,
    deleteServiceSpec: PropTypes.func.isRequired,
    serviceSpecsPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchServiceSpecs: PropTypes.func.isRequired,
    unloadServiceSpecs: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, fetchServiceSpecs } = this.props;

    fetchServiceSpecs(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadServiceSpecs } = this.props;

    unloadServiceSpecs();
  }

  deleteOne = (row) => {
    const { match, deleteServiceSpec, fetchServiceSpecs } = this.props;

    const onSuccess = () => {
      fetchServiceSpecs(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteServiceSpec(match.params.fqon, row.id, onSuccess);
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
      // {
      //   name: 'Actions',
      //   width: '42px',
      //   compact: true,
      //   cell: row => (
      //     <GenericMenuActions
      //       row={row}
      //       fqon={this.props.match.params.fqon}
      //       onDelete={this.deleteOne}
      //       editURL={`${this.props.match.url}/${row.id}`}
      //       entityKey="serviceSpecs"
      //       disableEntitlements
      //       {...this.props}
      //     />
      //   ),
      // }
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
  withMetaResource,
  connect(null),
)(PolicyListing);
