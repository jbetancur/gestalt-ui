import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { DataFeedIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import Checkbox from 'components/Fields/CheckboxMini';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import { generateContextEntityState } from 'util/helpers/context';
import withDatafeeds from '../hocs/withDatafeeds';

const handleIndeterminate = isIndeterminate => isIndeterminate;

class DataFeedList extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    datafeedsActions: PropTypes.object.isRequired,
    datafeeds: PropTypes.array.isRequired,
    datafeedsPending: PropTypes.bool.isRequired,
  };

  static contextType = ModalConsumer;

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.populateFeeds();
  }

  populateFeeds() {
    const { match, datafeedsActions } = this.props;
    const entity = generateContextEntityState(match.params);

    datafeedsActions.fetchDatafeeds({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  deleteOne = (row) => {
    const { match, datafeedsActions } = this.props;
    const { showModal } = this.context;
    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.populateFeeds();
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete ${row.name}?`,
      forceOption: false,
      onProceed: ({ force }) => datafeedsActions.deleteDatafeed({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } }),
    });
  }

  deleteMultiple = () => {
    const { match, datafeedsActions } = this.props;
    const { selectedRows } = this.state;
    const { showModal } = this.context;
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState(prevState => ({ clearSelected: !prevState.clearSelected }));
      this.populateFeeds();
    };

    showModal(ConfirmModal, {
      title: 'Confirm Deleting Multiple Data Feeds',
      multipleItems: names,
      forceOption: false,
      onProceed: ({ force }) => datafeedsActions.deleteDatafeeds({ resources: selectedRows, fqon: match.params.fqon, onSuccess, params: { force } }),
    });
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
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="datafeeds"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
        cell: row => <Name name={row.name} description={row.description} />
      },
      {
        name: 'Type',
        selector: 'properties.kind',
        sortable: true,
      },
      {
        name: 'Format',
        selector: 'properties.data.format',
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
            title="Data Feed"
            data={this.props.datafeeds}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ indeterminate: handleIndeterminate }}
            sortIcon={<ArrowDownIcon />}
            defaultSortField="name"
            progressPending={this.props.datafeedsPending}
            progressComponent={<LinearProgress id="datafeed-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no data feeds to display" icon={<DataFeedIcon size={150} />} />}
            onRowClicked={this.handleRowClicked}
            actions={<SelectFilter disabled={this.props.datafeedsPending} />}
            pagination
            paginationPerPage={15}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  datafeeds: listSelectors.filterItems()(state, 'dataFeeds.datafeeds.datafeeds'),
});

export default compose(
  withDatafeeds,
  connect(mapStateToProps),
)(DataFeedList);
