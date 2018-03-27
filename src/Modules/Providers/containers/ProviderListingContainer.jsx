import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { ProviderIcon } from 'components/Icons';
import { Card, Checkbox, FontIcon } from 'react-md';
import { generateContextEntityState } from 'util/helpers/context';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class ProviderListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    deleteProviders: PropTypes.func.isRequired,
    deleteProvider: PropTypes.func.isRequired,
    providersPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    unloadProviders: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.populateProviders();
  }

  componentWillUnmount() {
    const { unloadProviders } = this.props;

    unloadProviders();
  }

  populateProviders() {
    const { match, fetchProviders } = this.props;
    const entity = generateContextEntityState(match.params);

    fetchProviders(match.params.fqon, entity.id, entity.key);
  }

  deleteOne = (row) => {
    const { match, deleteProvider } = this.props;

    const onSuccess = () => {
      this.populateProviders();
    };

    this.props.confirmDelete(() => {
      deleteProvider(match.params.fqon, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, deleteProviders, confirmDelete } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => item.id);
    const names = selectedRows.map(item => item.name);

    const onSuccess = () => {
      this.populateProviders();
    };

    confirmDelete(() => {
      deleteProviders(IDs, match.params.fqon, onSuccess);
    }, 'Confirm Delete Providers', names);
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
            entityKey="providers"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        compact: true,
        cell: row => (
          <Name
            name={row.name}
            description={row.description}
            maxWidth="450px"
          />
        )
      },
      {
        name: 'Type',
        selector: 'resource_type',
        sortable: true,
        format: row => row.resource_type && getLastFromSplit(row.resource_type),
      },
      {
        name: 'Parent',
        selector: 'properties.parent.name',
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
        width: '158px',
        cell: row => <Timestamp timestamp={row.created.timestamp} />,
      },
      {
        name: 'Modified',
        selector: 'modified.timestamp',
        sortable: true,
        width: '158px',
        cell: row => <Timestamp timestamp={row.modified.timestamp} />,
      },
    ];

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="Providers"
            data={this.props.providers}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.providersPending}
            progressComponent={<LinearProgress id="provider-listing" />}
            columns={columns}
            contextActions={contextActions}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no providers to display" icon={<ProviderIcon size={150} />} />}
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
)(ProviderListing);

