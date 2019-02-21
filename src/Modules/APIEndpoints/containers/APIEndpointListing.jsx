import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Timestamp, GenericMenuActions } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton, ClipboardButton } from 'components/Buttons';
import { StatusBubble } from 'components/Status';
import { Title } from 'components/Typography';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { A } from 'components/Links';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import { getLastFromSplit } from 'util/helpers/strings';
import withAPIEndpoints from '../hocs/withAPIEndpoints';

const getBaseURL = (params, row) => `/${params.fqon}/hierarchy/${params.workspaceId}/environment/${params.environmentId}/apis/${params.apiId}/apiendpoints/${row.id}`;
const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class APIEndpointListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    apiEndpointsPending: PropTypes.bool.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
  };

  static contextType = ModalConsumer;

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
    const { showModal } = this.context;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete ${row.properties.resource}?`,
      onProceed: ({ force }) => apiEndpointsActions.deleteAPIEndpoint({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } }),
    });
  }


  deleteMultiple = () => {
    const { match, apiEndpointsActions } = this.props;
    const { selectedRows } = this.state;
    const { showModal } = this.context;
    const names = selectedRows.map(item => item.properties.resource);

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.init();
    };

    showModal(ConfirmModal, {
      title: 'Confirm Deleting Multiple API Endpoints',
      multipleItems: names,
      onProceed: ({ force }) => apiEndpointsActions.deleteAPIEndpoints({ resources: selectedRows, fqon: match.params.fqon, onSuccess, params: { force } }),
    });
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
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        center: true,
        cell: row => (
          <GenericMenuActions
            row={row}
            rowNameField="properties.resource"
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
        sortable: true,
        allowOverflow: true,
        maxWidth: '120px',
        cell: row => <StatusBubble status={getLastFromSplit(row.resource_state)} />
      },
      {
        name: 'Resource',
        selector: 'properties.resource',
        sortable: true,
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
        <Col flex={12}>
          <Card>
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
              subHeader
              subHeaderComponent={<SelectFilter disabled={this.props.apiEndpointsPending} />}
              pagination
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  apiEndpoints: listSelectors.filterItems()(state, 'apiEndpoints.apiEndpoints.apiEndpoints'),
});

export default compose(
  withAPIEndpoints(),
  connect(mapStateToProps),
)(APIEndpointListing);
