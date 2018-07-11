import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Timestamp, GenericMenuActions } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton, ClipboardButton } from 'components/Buttons';
import StatusBubble from 'components/StatusBubble';
import { Title } from 'components/Typography';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { withAPIEndpoints } from 'Modules/MetaResource';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { A } from 'components/Links';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';

const getBaseURL = (params, row) => `/${params.fqon}/hierarchy/${params.workspaceId}/environment/${params.environmentId}/apis/${params.apiId}/apiendpoints/${row.id}`;
const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class APIEndpointListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.init();
  }

  init() {
    const { match, apiEndpointsActions } = this.props;

    apiEndpointsActions.fetchAPIEndpoints({ fqon: match.params.fqon, entityId: match.params.apiId, entityKey: 'apis' });
  }

  deleteOne = (row) => {
    const { match, apiEndpointsActions } = this.props;

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      this.init();
    };

    this.props.confirmDelete(({ force }) => {
      apiEndpointsActions.deleteAPIEndpoint({ fqon: match.params.fqon, id: row.id, onSuccess, params: { force } });
    }, `Are you sure you want to delete ${row.name}?`);
  }


  deleteMultiple = () => {
    const { match, apiEndpointsActions } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => item.id);
    const names = selectedRows.map(item => item.name);

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      this.init();
    };

    this.props.confirmDelete(({ force }) => {
      apiEndpointsActions.deleteAPIEndpoints({ ids: IDs, fqon: match.params.fqon, onSuccess, params: { force } });
    }, 'Confirm Delete apiEndpoints', names);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(getBaseURL(match.params, row));
  }

  defineContectActions() {
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
        allowOverflow: true,
        center: true,
        maxWidth: '120px',
        cell: row => <StatusBubble status={getLastFromSplit(row.resource_state)} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        maxWidth: '175px',
      },
      {
        name: 'Public URL',
        selector: 'properties.public_url',
        sortable: true,
        ignoreRowClick: true,
        maxWidth: '350px',
        grow: 2,
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
            primary
          >
            {row.properties.public_url}
          </A>
        ]
      },
      {
        name: 'Type',
        selector: 'properties.implementation_type',
        sortable: true,
        maxWidth: '120px',
      },
      {
        name: 'Auth',
        selector: 'properties.plugins.gestaltSecurity.enabled',
        sortable: true,
        center: true,
        maxWidth: '85px',
        cell: row => <Checkbox disabled defaultChecked={row.properties.plugins && row.properties.plugins.gestaltSecurity && row.properties.plugins.gestaltSecurity.enabled} />,
      },
      {
        name: 'Limit (m)',
        selector: 'properties.plugins.rateLimit.perMinute',
        sortable: true,
        right: true,
        maxWidth: '85px',
        format: row => (row.properties.plugins && row.properties.plugins.rateLimit && row.properties.plugins.rateLimit.enabled && row.properties.plugins.rateLimit.perMinute) || '∞',
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
    ];
  }

  render() {
    return (
      <Row>
        <Col component={Card} flex={12}>
          <DataTable
            title="API Endpoints"
            data={this.props.apiEndpoints}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.apiEndpointsPending}
            progressComponent={<LinearProgress id="apiendpoints-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContectActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<Title light>There are no endpoints to display</Title>}
            onRowClicked={this.handleRowClicked}
            actions={<SelectFilter disabled={this.props.apiEndpointsPending} />}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  apiEndpoints: listSelectors.filterItems()(state, 'apiEndpoints', 'apiEndpoints'),
});

export default compose(
  withAPIEndpoints(),
  connect(mapStateToProps, actions),
)(APIEndpointListing);

