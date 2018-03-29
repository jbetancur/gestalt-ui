import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, Endpoints, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { Card, Checkbox, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import { LambdaIcon } from 'components/Icons';
import LambdaMenuActions from '../components/LambdaMenuActions';
// import LambdaExpanderRow from '../components/LambdaExpanderRow'
import actions from '../actions';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class LambdaListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    lambdas: PropTypes.array.isRequired,
    deleteLambdas: PropTypes.func.isRequired,
    deleteLambda: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchLambdas: PropTypes.func.isRequired,
    unloadLambdas: PropTypes.func.isRequired,
    lambdasPending: PropTypes.bool.isRequired,
    fetchActions: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, fetchLambdas, fetchActions } = this.props;

    fetchLambdas(match.params.fqon, match.params.environmentId);
    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'lambda.detail' });
  }

  componentWillUnmount() {
    const { unloadLambdas } = this.props;

    unloadLambdas();
  }

  deleteOne = (row) => {
    const { match, deleteLambda, fetchLambdas } = this.props;

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      fetchLambdas(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteLambda(match.params.fqon, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, deleteLambdas, fetchLambdas } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => (item.id));
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      fetchLambdas(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteLambdas(IDs, match.params.fqon, onSuccess);
    }, 'Confirm Delete Lambdas', names);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
  }

  render() {
    const contextActions = [
      <DeleteIconButton key="delete-items" onClick={this.deleteMultiple} />,
    ];

    const columns = [
      {
        width: '42px',
        ignoreRowClick: true,
        cell: row => (
          <LambdaMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${this.props.match.url}/${row.id}`}
            {...this.props}
          />
        ),
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
        selector: 'lambda.properties.apiendpoints',
        compact: true,
        ignoreRowClick: true,
        cell: row => <Endpoints endpoints={row.properties.apiendpoints} />
      },
      {
        name: 'Runtime',
        selector: 'properties.runtime',
        sortable: true,
        width: '200px',
      },
      {
        name: 'Owner',
        selector: 'owner.name',
        sortable: true,
        width: '200px',
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        width: '158px',
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
      {
        name: 'Modified',
        selector: 'modified.timestamp',
        sortable: true,
        width: '158px',
        cell: row => <Timestamp timestamp={row.modified.timestamp} />
      },
    ];

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="Lambdas"
            data={this.props.lambdas}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            // expandableRows
            // expandableRowsComponent={<LambdaExpanderRow />}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.lambdasPending}
            progressComponent={<LinearProgress id="lambda-listing" />}
            columns={columns}
            contextActions={contextActions}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no lambdas to display" icon={<LambdaIcon size={150} />} />}
            onRowClicked={this.handleRowClicked}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withMetaResource,
  connect(null, actions),
)(LambdaListing);

