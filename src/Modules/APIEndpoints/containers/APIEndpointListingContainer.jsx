import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton, ClipboardButton } from 'components/Buttons';
import StatusBubble from 'components/StatusBubble';
import { Card, Checkbox, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import A from 'components/A';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';

const getBaseURL = (params, row) => `/${params.fqon}/hierarchy/${params.workspaceId}/environment/${params.environmentId}/apis/${params.apiId}/apiendpoints/${row.id}`;
const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class APIEndpointListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    deleteAPIEndpoint: PropTypes.func.isRequired,
    deleteAPIEndpoints: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.populalateEndpoints();
  }

  componentWillUnmount() {
    const { unloadAPIEndpoints } = this.props;

    unloadAPIEndpoints();
  }

  populalateEndpoints() {
    const { match, fetchAPIEndpoints } = this.props;

    fetchAPIEndpoints(match.params.fqon, match.params.apiId, 'apis');
  }

  deleteOne = (row) => {
    const { match, deleteAPIEndpoint } = this.props;

    const onSuccess = () => {
      this.populalateEndpoints();
    };

    this.props.confirmDelete(() => {
      deleteAPIEndpoint(match.params.fqon, row.id, onSuccess);
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, deleteAPIEndpoints, fetchAPIEndpoints } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => item.id);
    const names = selectedRows.map(item => item.name);

    const onSuccess = () => {
      this.setState({ clearSelected: true });
      fetchAPIEndpoints(match.params.fqon, match.params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteAPIEndpoints(IDs, match.params.fqon, onSuccess);
    }, 'Confirm Delete apiEndpoints', names);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  render() {
    const contextActions = [
      <DeleteIconButton key="delete-items" onClick={this.deleteMultiple} />,
    ];

    const columns = [
      {
        name: 'Actions',
        width: '42px',
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={getBaseURL(this.props.match.params, row)}
            entityKey="apiendpoints"
            {...this.props}
          />
        ),
      },
      {
        name: 'State',
        selector: 'resource_state',
        compact: true,
        sortable: true,
        width: '42px',
        cell: row => <StatusBubble status={getLastFromSplit(row.resource_state)} />
      },
      {
        name: 'Path',
        selector: 'name',
        sortable: true,
        cell: row => <Name name={row.name} description={row.description} linkable to={getBaseURL(this.props.match.params, row)} />
      },
      {
        name: 'Public URL',
        selector: 'properties.public_url',
        sortable: true,
        cell: row => [
          <ClipboardButton
            key={`public-url-copy-${row.id}`}
            showLabel={false}
            text={row.properties.public_url}
          />,
          <A
            key={`public-url-link0${row.id}`}
            href={row.properties.public_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.properties.public_url}
          </A>
        ]
      },
      {
        name: 'Type',
        selector: 'properties.implementation_type',
        sortable: true,
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
    ];

    return (
      <Row>
        <Col component={Card} flex={12}>
          <DataTable
            title="Endpoints"
            data={this.props.apiEndpoints}
            highlightOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.apiEndpointsPending}
            progressComponent={<LinearProgress id="apiendpoints-listing" />}
            columns={columns}
            contextActions={contextActions}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent="There are no api endpoints to display"
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withMetaResource,
  connect(null, actions),
)(APIEndpointListing);

