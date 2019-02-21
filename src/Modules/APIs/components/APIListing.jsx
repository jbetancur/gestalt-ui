import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { APIIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import { generateContextEntityState } from 'util/helpers/context';
import actions from '../actions';
import withAPIs from '../hocs/withAPIs';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class APIListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    apis: PropTypes.array.isRequired,
    apisPending: PropTypes.bool.isRequired,
    apisActions: PropTypes.object.isRequired,
  };

  static contextType = ModalConsumer;

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.populateAPIs();
  }

  populateAPIs() {
    const { match, apisActions } = this.props;
    const entity = generateContextEntityState(match.params);

    apisActions.fetchAPIs({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  deleteOne = (row) => {
    const { match, apisActions } = this.props;
    const { showModal } = this.context;

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.populateAPIs();
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete ${row.name}?`,
      onProceed: ({ force }) => apisActions.deleteAPI({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } }),
    });
  }

  deleteMultiple = () => {
    const { match, apisActions } = this.props;
    const { selectedRows } = this.state;
    const { showModal } = this.context;
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.populateAPIs();
    };

    showModal(ConfirmModal, {
      title: 'Confirm Deleting Multiple APIs',
      multipleItems: names,
      onProceed: ({ force }) => apisActions.deleteAPIs({ resources: selectedRows, fqon: match.params.fqon, onSuccess, params: { force } }),
    });
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
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
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="apis"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 3,
        cell: row => <Name name={row.name} description={row.description} />
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
        <Col flex={12}>
          <Card>
            <DataTable
              title="APIs"
              data={this.props.apis}
              highlightOnHover
              pointerOnHover
              selectableRows
              selectableRowsComponent={Checkbox}
              selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              progressPending={this.props.apisPending}
              progressComponent={<LinearProgress id="api-listing" />}
              columns={this.defineColumns()}
              contextActions={this.defineContectActions()}
              onTableUpdate={this.handleTableChange}
              clearSelectedRows={this.state.clearSelected}
              noDataComponent={<NoData message="There are no apis to display" icon={<APIIcon size={150} />} />}
              onRowClicked={this.handleRowClicked}
              subHeader
              subHeaderComponent={<SelectFilter disabled={this.props.apisPending} />}
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
  apis: listSelectors.filterItems()(state, 'apis.apis.apis'),
});

export default compose(
  withAPIs,
  connect(mapStateToProps, actions),
)(APIListing);
