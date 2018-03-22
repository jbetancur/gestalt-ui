import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { Card, Checkbox, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import actions from '../actions';

class ResourceTypeListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    resourceTypes: PropTypes.array.isRequired,
    deleteResourceType: PropTypes.func.isRequired,
    resourceTypesPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchResourceTypes: PropTypes.func.isRequired,
    unloadResourceTypes: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, fetchResourceTypes } = this.props;

    fetchResourceTypes(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadResourceTypes } = this.props;

    unloadResourceTypes();
  }

  deleteOne = (row) => {
    const { match, deleteResourceType, fetchResourceTypes } = this.props;

    const onSuccess = () => {
      fetchResourceTypes(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteResourceType(match.params.fqon, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  render() {
    const contextActions = [
      <DeleteIconButton key="delete-items" onClick={this.deleteMultiple} />,
    ];

    const columns = [
      {
        name: 'Actions',
        width: '42px',
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="resourceTypes"
            disableEntitlements
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        compact: true,
        cell: row => <Name maxWidth="500px" name={row.name} description={row.description} linkable to={`${this.props.match.url}/${row.id}`} />
      },
      {
        name: 'Abstract',
        selector: 'properties.abstract',
        sortable: true,
        cell: row => <Checkbox inkDisabled defaultChecked={row.properties.abstract} disabled />
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

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="Resource Types"
            data={this.props.resourceTypes}
            highlightOnHover
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.resourceTypesPending}
            progressComponent={<LinearProgress id="resourcetype-listing" />}
            columns={columns}
            contextActions={contextActions}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent="There are no resource types to display"
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withMetaResource,
  connect(null, actions),
)(ResourceTypeListing);
