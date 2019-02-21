import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, Endpoints, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { LambdaIcon } from 'components/Icons';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { generateContextEntityState } from 'util/helpers/context';
import LambdaMenuActions from './LambdaMenuActions';
// import LambdaExpanderRow from '../components/LambdaExpanderRow'
import withLambdas from '../hocs/withLambdas';
import iconMap from '../../Providers/config/iconMap';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);
const tableTheme = {
  rows: {
    fontSize: '12px',
  }
};

class LambdaListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    lambdas: PropTypes.array.isRequired,
    lambdasActions: PropTypes.object.isRequired,
    lambdasPending: PropTypes.bool.isRequired,
  };

  static contextType = ModalConsumer;

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.populateLambdas();
  }

  populateLambdas() {
    const { match, lambdasActions } = this.props;
    const entity = generateContextEntityState(match.params);

    lambdasActions.fetchLambdas({ fqon: match.params.fqon, environmentId: entity.id });
  }

  deleteOne = (row) => {
    const { match, lambdasActions } = this.props;
    const { showModal } = this.context;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete ${row.name}?`,
      onProceed: ({ force }) => lambdasActions.deleteLambda({ fqon: match.params.fqon, resource: row, onSuccess, force }),
    });
  }

  deleteMultiple = () => {
    const { match, lambdasActions } = this.props;
    const { selectedRows } = this.state;
    const { showModal } = this.context;
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
    };

    showModal(ConfirmModal, {
      title: 'Confirm Deleting Multiple Lambdas',
      multipleItems: names,
      onProceed: ({ force }) => lambdasActions.deleteLambdas({ resources: selectedRows, fqon: match.params.fqon, onSuccess, force }),
    });
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
    const { match } = this.props;

    return [
      {
        width: '56px',
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <LambdaMenuActions
            row={row}
            fqon={match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${match.url}/${row.id}`}
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
        selector: 'lambda.properties.apiendpoints',
        compact: true,
        ignoreRowClick: true,
        grow: 2,
        cell: row => <Endpoints endpoints={row.properties.apiendpoints} />
      },
      {
        name: 'Runtime',
        selector: 'properties.runtime',
        sortable: true,
        compact: true,
        center: true,
        cell: row => iconMap(row.properties.runtime),
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
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
      {
        name: 'Modified',
        selector: 'modified.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.modified.timestamp} />
      },
    ];
  }

  render() {
    const { lambdas, lambdasPending } = this.props;

    return (
      <Row gutter={5}>
        <Col flex={12}>
          <Card>
            <DataTable
              title="Lambdas"
              customTheme={tableTheme}
              data={lambdas}
              highlightOnHover
              pointerOnHover
              selectableRows
              selectableRowsComponent={Checkbox}
              selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
              // expandableRows
              // expandableRowsComponent={<LambdaExpanderRow />}
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              progressPending={lambdasPending}
              progressComponent={<LinearProgress id="lambda-listing" />}
              columns={this.defineColumns()}
              contextActions={this.defineContextActions()}
              onTableUpdate={this.handleTableChange}
              clearSelectedRows={this.state.clearSelected}
              noDataComponent={<NoData message="There are no lambdas to display" icon={<LambdaIcon size={150} />} />}
              onRowClicked={this.handleRowClicked}
              actions={<SelectFilter disabled={lambdasPending} />}
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
  lambdas: listSelectors.filterItems()(state, 'lambdas.lambdas.lambdas'),
});

export default compose(
  withLambdas,
  connect(mapStateToProps),
)(LambdaListing);
