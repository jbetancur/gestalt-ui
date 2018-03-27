import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { SecretIcon } from 'components/Icons';
import { Card, Checkbox, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import actions from '../actions';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class SecretListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    secrets: PropTypes.array.isRequired,
    deleteSecrets: PropTypes.func.isRequired,
    deleteSecret: PropTypes.func.isRequired,
    secretsPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchSecrets: PropTypes.func.isRequired,
    unloadSecrets: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, fetchSecrets } = this.props;

    fetchSecrets(match.params.fqon, match.params.environmentId);
  }

  componentWillUnmount() {
    const { unloadSecrets } = this.props;

    unloadSecrets();
  }

  deleteOne = (row) => {
    const { match, deleteSecret, fetchSecrets } = this.props;

    const onSuccess = () => {
      fetchSecrets(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteSecret(match.params.fqon, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, deleteSecrets, fetchSecrets } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => item.id);
    const names = selectedRows.map(item => item.name);

    const onSuccess = () => {
      this.setState({ clearSelected: true });
      fetchSecrets(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteSecrets(IDs, match.params.fqon, onSuccess);
    }, 'Confirm Delete Secrets', names);
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
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="secrets"
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
        name: 'Provider',
        selector: 'properties.provider.name',
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
            title="Secrets"
            data={this.props.secrets}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.secretsPending}
            progressComponent={<LinearProgress id="secret-listing" />}
            columns={columns}
            contextActions={contextActions}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no secrets to display" icon={<SecretIcon size={150} />} />}
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
)(SecretListing);
