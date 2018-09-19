import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { PolicyIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { withPolicies } from 'Modules/MetaResource';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { generateContextEntityState } from 'util/helpers/context';
import actions from '../actions';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class PolicyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    policies: PropTypes.array.isRequired,
    policiesPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    policiesActions: PropTypes.object.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.init();
  }

  init() {
    const { match, policiesActions } = this.props;
    const entity = generateContextEntityState(match.params);

    policiesActions.fetchPolicies({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  deleteOne = (row) => {
    const { match, policiesActions } = this.props;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    this.props.confirmDelete(({ force }) => {
      policiesActions.deletePolicy({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } });
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, policiesActions } = this.props;
    const { selectedRows } = this.state;
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    this.props.confirmDelete(({ force }) => {
      policiesActions.deletePolicies({ resources: selectedRows, fqon: match.params.fqon, onSuccess, params: { force } });
    }, 'Confirm Delete Policies', names);
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
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="policies"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        compact: true,
        grow: 3,
        cell: row => <Name name={row.name} description={row.description} />
      },
      {
        name: 'Rules',
        selector: 'properties.rules',
        sortable: true,
        right: true,
        format: row => row.properties.rules.length,
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
            title="Policies"
            data={this.props.policies}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.policiesPending}
            progressComponent={<LinearProgress id="policy-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no policies to display" icon={<PolicyIcon size={150} />} />}
            onRowClicked={this.handleRowClicked}
            actions={<SelectFilter disabled={this.props.policiesPending} />}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  policies: listSelectors.filterItems()(state, 'policies.policies.policies'),
});

export default compose(
  withPolicies,
  connect(mapStateToProps, actions),
)(PolicyListing);
