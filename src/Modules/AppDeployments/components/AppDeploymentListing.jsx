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
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import Checkbox from 'components/Fields/CheckboxMini';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import ExpanderRow from './ExpanderRow';
import withAppDeployments from '../hocs/withAppDeployments';

const handleIndeterminate = isIndeterminate => isIndeterminate;

class AppDeploymenListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    appDeploymentsActions: PropTypes.object.isRequired,
    appDeployments: PropTypes.array.isRequired,
    appDeploymentsPending: PropTypes.bool.isRequired,
  };

  static contextType = ModalContext;

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { appDeploymentsActions } = this.props;

    appDeploymentsActions.fetchAppDeployments();
  }

  deleteOne = (row) => {
    const { appDeploymentsActions } = this.props;
    const { showModal } = this.context;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete ${row.name}?`,
      onProceed: ({ force }) => appDeploymentsActions.deleteAppDeployment({ resource: row, onSuccess, force }),
    });
  }

  deleteMultiple = () => {
    const { appDeploymentsActions } = this.props;
    const { selectedRows } = this.state;
    const { showModal } = this.context;
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
    };

    showModal(ConfirmModal, {
      title: 'Confirm Deleting Multiple App Deployments',
      multipleItems: names,
      onProceed: ({ force }) => appDeploymentsActions.deleteAppDeployments({ resources: selectedRows, onSuccess, force }),
    });
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
        button: true,
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
        <Col flex={12}>
          <Card>
            <DataTable
              title="Application Deployments"
              data={this.props.appDeployments}
              // highlightOnHover
              // pointerOnHover
              selectableRows
              selectableRowsComponent={Checkbox}
              selectableRowsComponentProps={{ indeterminate: handleIndeterminate }}
              sortIcon={<ArrowDownIcon />}
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
              paginationPerPage={15}
            />
          </Card>
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
  connect(mapStateToProps),
)(AppDeploymenListing);
