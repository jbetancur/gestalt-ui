import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, LinearProgress } from 'components/TableCells';
import { DeleteIconButton } from 'components/Buttons';
import { Card, Checkbox, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import actions from '../actions';

class PolicyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    deleteGroups: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    groupsPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired,
    unloadGroups: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, fetchGroups } = this.props;

    fetchGroups(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadGroups } = this.props;

    unloadGroups();
  }

  deleteOne = (row) => {
    const { match, deleteGroup, fetchGroups } = this.props;

    const onSuccess = () => {
      fetchGroups(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteGroup(match.params.fqon, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, deleteGroups, fetchGroups } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => (item.id));
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState({ clearSelected: true });
      fetchGroups(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteGroups(IDs, match.params.fqon, onSuccess);
    }, 'Confirm Delete Groups', names);
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
        name: 'Name',
        selector: 'name',
        sortable: true,
        compact: true,
        cell: row => <Name name={row.name} description={row.description} linkable to={`${this.props.match.url}/${row.id}`} />
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
      {
        name: 'Actions',
        width: '42px',
        compact: true,
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="groups"
            disableEntitlements
            {...this.props}
          />
        ),
      }
    ];

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="groups"
            data={this.props.groups}
            highlightOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.groupsPending}
            progressComponent={<LinearProgress id="user-listing" />}
            columns={columns}
            contextActions={contextActions}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent="There are no groups to display"
            overflowY
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withMetaResource,
  connect(null, actions),
)(PolicyListing);
