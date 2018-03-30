import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { Title } from 'components/Typography';
import { Card, Checkbox, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';

const getBaseURL = (params, row) => `/${params.fqon}/hierarchy/${params.workspaceId}/environment/${params.environmentId}/policies/${params.policyId}/rules/${row.id}/edit${getLastFromSplit(row.resource_type)}Rule`;
const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class PolicyRuleListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    policyRules: PropTypes.array.isRequired,
    deletePolicyRules: PropTypes.func.isRequired,
    deletePolicyRule: PropTypes.func.isRequired,
    policyRulesPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchPolicyRules: PropTypes.func.isRequired,
    unloadPolicyRules: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, fetchPolicyRules } = this.props;

    fetchPolicyRules(match.params.fqon, match.params.policyId);
  }

  componentWillUnmount() {
    const { unloadPolicyRules } = this.props;

    unloadPolicyRules();
  }

  deleteOne = (row) => {
    const { match, deletePolicyRule, fetchPolicyRules } = this.props;

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      fetchPolicyRules(match.params.fqon, match.params.policyId);
    };

    this.props.confirmDelete(() => {
      deletePolicyRule(match.params.fqon, match.params.policyId, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, deletePolicyRules, fetchPolicyRules } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => item.id);
    const names = selectedRows.map(item => item.name);

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      fetchPolicyRules(match.params.fqon, match.params.policyId);
    };

    this.props.confirmDelete(() => {
      deletePolicyRules(IDs, match.params.fqon, match.params.policyId, onSuccess);
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
            editURL={getBaseURL(this.props.match.params, row)}
            entityKey="rules"
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
    return (
      <Row>
        <Col component={Card} flex={12}>
          <DataTable
            title="Policy Rules"
            data={this.props.policyRules}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.policyRulesPending}
            progressComponent={<LinearProgress id="policy-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<Title>There are no rules to display</Title>}
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
)(PolicyRuleListing);

