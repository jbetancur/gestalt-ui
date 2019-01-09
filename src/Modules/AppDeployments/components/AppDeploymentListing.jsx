import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { AppDeploymentIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { StatusBubble } from 'components/Status';
import { Checkbox, FontIcon } from 'react-md';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import ExpanderRow from './ExpanderRow';
import actions from '../actions';
import withAppDeployments from '../hocs/withAppDeployments';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class AppDeploymenListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    appDeploymentsActions: PropTypes.object.isRequired,
    appDeployments: PropTypes.array.isRequired,
    appDeploymentsPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { appDeploymentsActions } = this.props;

    appDeploymentsActions.fetchAppDeployments();
  }

  deleteOne = (row) => {
    const { appDeploymentsActions, confirmDelete } = this.props;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
    };

    confirmDelete(({ force }) => {
      appDeploymentsActions.deleteAppDeployment({ resource: row, onSuccess, force });
    }, `Are you sure you want to delete ${row.name}?`);
  }

  deleteMultiple = () => {
    const { appDeploymentsActions, confirmDelete } = this.props;
    const { selectedRows } = this.state;

    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
    };

    confirmDelete(({ force }) => {
      appDeploymentsActions.deleteAppDeployments({ resources: selectedRows, onSuccess, force });
    }, 'Confirm Delete App Deployments', names);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  // handleRowClicked = (row) => {
  //   const { history, match } = this.props;

  //   history.push(`${match.url}/${row.id}`);
  // }

  defineContextActions() {
    return [
      <DeleteIconButton key="delete-items" onClick={this.deleteMultiple} />,
    ];
  }

  defineColumns() {
    return [
      {
        width: '56px',
        center: true,
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            entityKey="appdeployments"
            {...this.props}
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
        name: 'Status',
        selector: 'properties.data.status',
        sortable: true,
        cell: row => <StatusBubble status={row.properties.data.status} />
      },
      {
        name: 'Namespace',
        selector: 'properties.data.native_namespace',
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
            title="Application Deployments"
            data={this.props.appDeployments}
            // highlightOnHover
            // pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.appDeploymentsPending}
            progressComponent={<LinearProgress id="user-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no application deployments to display" icon={<AppDeploymentIcon size={150} />} />}
            // onRowClicked={this.handleRowClicked}
            actions={<SelectFilter disabled={this.props.appDeploymentsPending} />}
            expandableRows
            expandableRowsComponent={<ExpanderRow />}
            pagination
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  appDeployments: listSelectors.filterItems()(state, 'appDeployments.appDeployments.appDeployments'),
});

export default compose(
  withAppDeployments(),
  connect(mapStateToProps, actions),
)(AppDeploymenListing);
