import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { Title } from 'components/Typography';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';
import withPolicyRules from '../hocs/withPolicyRules';

const getBaseURL = (params, row) => `/${params.fqon}/hierarchy/${params.workspaceId}/environment/${params.environmentId}/policies/${params.policyId}/rules/${row.id}/edit${getLastFromSplit(row.resource_type)}Rule`;
const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class PolicyRuleListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    policyRules: PropTypes.array.isRequired,
    policyRulesActions: PropTypes.object.isRequired,
    policyRulesPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.init();
  }

  init() {
    const { match, policyRulesActions } = this.props;

    policyRulesActions.fetchPolicyRules({ fqon: match.params.fqon, entityId: match.params.policyId, entityKey: 'policies' });
  }

  deleteOne = (row) => {
    const { match, policyRulesActions } = this.props;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    this.props.confirmDelete(({ force }) => {
      policyRulesActions.deletePolicyRule({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } });
    }, `Are you sure you want to delete ${row.name}?`);
  }

  deleteMultiple = () => {
    const { match, policyRulesActions } = this.props;
    const { selectedRows } = this.state;
    const names = selectedRows.map(item => item.name);

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    this.props.confirmDelete(({ force }) => {
      policyRulesActions.deletePolicyRules({ resources: selectedRows, fqon: match.params.fqon, onSuccess, params: { force } });
    }, 'Confirm Delete Rules', names);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(getBaseURL(match.params, row));
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
          <GenericMenuActions
            row={row}
            fqon={match.params.fqon}
            onDelete={this.deleteOne}
            editURL={getBaseURL(match.params, row)}
            entityKey="rules"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 3,
        cell: row => (
          <Name name={row.name} description={row.description} />
        )
      },
      {
        name: 'Rule Type',
        selector: 'resource_type',
        sortable: true,
        format: row => getLastFromSplit(row.resource_type),
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
    const { policyRules, policyRulesPending } = this.props;
    const { clearSelected } = this.state;

    return (
      <Row>
        <Col flex={12}>
          <Card>
            <DataTable
              title="Policy Rules"
              data={policyRules}
              highlightOnHover
              pointerOnHover
              selectableRows
              selectableRowsComponent={Checkbox}
              selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              progressPending={policyRulesPending}
              progressComponent={<LinearProgress id="policy-listing" />}
              columns={this.defineColumns()}
              contextActions={this.defineContextActions()}
              onTableUpdate={this.handleTableChange}
              clearSelectedRows={clearSelected}
              noDataComponent={<Title light>There are no rules to display</Title>}
              onRowClicked={this.handleRowClicked}
              actions={<SelectFilter disabled={policyRulesPending} />}
              pagination
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  policyRules: listSelectors.filterItems()(state, 'policyRules.policyRules.policyRules'),
});

export default compose(
  withPolicyRules,
  withRouter,
  connect(mapStateToProps, actions),
)(PolicyRuleListing);
