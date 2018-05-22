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
import { withLambdas } from 'Modules/MetaResource';
import { LambdaIcon } from 'components/Icons';
import { generateContextEntityState } from 'util/helpers/context';
import LambdaMenuActions from '../components/LambdaMenuActions';
import ListIcon from '../components/ListIcon';
// import LambdaExpanderRow from '../components/LambdaExpanderRow'
import actions from '../actions';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class LambdaListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    lambdas: PropTypes.array.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    lambdasActions: PropTypes.object.isRequired,
    lambdasPending: PropTypes.bool.isRequired,
  };

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

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      this.populateLambdas();
    };

    this.props.confirmDelete(() => {
      lambdasActions.deleteLambda({ fqon: match.params.fqon, lambdaId: row.id, onSuccess });
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, lambdasActions } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => (item.id));
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      this.populateLambdas();
    };

    this.props.confirmDelete(() => {
      lambdasActions.deleteLambdas({ lambdaIds: IDs, fqon: match.params.fqon, onSuccess });
    }, 'Confirm Delete Lambdas', names);
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
        cell: row => <ListIcon runtime={row.properties.runtime} />,
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
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
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
  withLambdas,
  connect(null, actions),
)(LambdaListing);

