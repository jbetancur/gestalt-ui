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

class UserListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    usersPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    unloadUsers: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, fetchUsers } = this.props;

    fetchUsers(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadUsers } = this.props;

    unloadUsers();
  }

  deleteOne = (row) => {
    const { match, deleteUser, fetchUsers } = this.props;

    const onSuccess = () => {
      fetchUsers(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteUser(match.params.fqon, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, deleteUsers, fetchUsers } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => (item.id));
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState({ clearSelected: true });
      fetchUsers(match.params.fqon);
    };

    this.props.confirmDelete(() => {
      deleteUsers(IDs, match.params.fqon, onSuccess);
    }, 'Confirm Delete Users', names);
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
        name: 'First Name',
        selector: 'properties.firstName',
        sortable: true,
      },
      {
        name: 'Last Name',
        selector: 'properties.lastName',
        sortable: true,
      },
      {
        name: 'Email',
        selector: 'properties.email',
        sortable: true,
      },
      {
        name: 'Home Org',
        selector: 'properties.gestalt_home',
        sortable: true,
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
            entityKey="users"
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
            title="Users"
            data={this.props.users}
            highlightOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.usersPending}
            progressComponent={<LinearProgress id="user-listing" />}
            columns={columns}
            contextActions={contextActions}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent="There are no users to display"
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
)(UserListing);
