import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { UserIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import actions from '../actions';
import withUsers from '../hocs/withUsers';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class UserListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    usersActions: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    usersPending: PropTypes.bool.isRequired,
    showReparentModal: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, usersActions } = this.props;

    usersActions.fetchUsers({ fqon: match.params.fqon });
  }

  deleteOne = (row) => {
    const { match, usersActions, showReparentModal } = this.props;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      usersActions.fetchUsers({ fqon: match.params.fqon });
    };

    showReparentModal(({ force, parent }) => {
      usersActions.deleteUser({ fqon: match.params.fqon, resource: row, onSuccess, params: { force, parent } });
    }, `Are you sure you want to delete ${row.name}?`);
  }

  deleteMultiple = () => {
    const { match, usersActions, showReparentModal } = this.props;
    const { selectedRows } = this.state;
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      usersActions.fetchUsers({ fqon: match.params.fqon });
    };

    showReparentModal(({ force, parent }) => {
      usersActions.deleteUsers({ resources: selectedRows, fqon: match.params.fqon, onSuccess, params: { force, parent } });
    }, 'Confirm Delete Users', names);
  }

  reparent = (row) => {
    const { showReparentModal } = this.props;

    showReparentModal(() => { }, `Reparent ${row.name}`);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
  }

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
            onReparent={this.reparent}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="users"
            disableEntitlements
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 3,
        cell: row => <Name name={row.name} description={row.description} />
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
    ];
  }

  render() {
    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="Users"
            data={this.props.users}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.usersPending}
            progressComponent={<LinearProgress id="user-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no users to display" icon={<UserIcon size={150} />} />}
            onRowClicked={this.handleRowClicked}
            actions={<SelectFilter disabled={this.props.usersPending} />}
            pagination
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  users: listSelectors.filterItems()(state, 'users.users.users'),
});

export default compose(
  withUsers(),
  connect(mapStateToProps, actions),
)(UserListing);
