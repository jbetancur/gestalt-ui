import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { StreamIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { withStreamSpec } from 'Modules/MetaResource';
import { generateContextEntityState } from 'util/helpers/context';
import actions from '../actions';

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

class StreamList extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    streamSpecs: PropTypes.array.isRequired,
    streamSpecsPending: PropTypes.bool.isRequired,
    streamSpecActions: PropTypes.object.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    this.populateStreams();
  }

  componentWillUnmount() {
    const { streamSpecActions } = this.props;

    streamSpecActions.unloadStreamSpecs();
  }

  populateStreams() {
    const { match, streamSpecActions } = this.props;
    const entity = generateContextEntityState(match.params);

    streamSpecActions.fetchStreamSpecs({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  deleteOne = (row) => {
    const { match, streamSpecActions } = this.props;
    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      this.populateStreams();
    };

    this.props.confirmDelete(() => {
      streamSpecActions.deleteStreamSpec({ fqon: match.params.fqon, id: row.id, onSuccess });
    }, `Are you sure you want to delete ${row.name}?`);
  }

  deleteMultiple = () => {
    const { match, streamSpecActions } = this.props;
    const { selectedRows } = this.state;

    const IDs = selectedRows.map(item => (item.id));
    const names = selectedRows.map(item => (item.name));

    const onSuccess = () => {
      this.setState({ clearSelected: !this.state.clearSelected });
      this.populateStreams();
    };

    this.props.confirmDelete(() => {
      streamSpecActions.deleteStreamSpecs({ fqon: match.params.fqon, ids: IDs, onSuccess });
    }, 'Confirm Delete Streams Specifications', names);
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
            entityKey="streamspecs"
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
            title="Stream Specifications"
            data={this.props.streamSpecs}
            highlightOnHover
            pointerOnHover
            selectableRows
            selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate }}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.streamSpecsPending}
            progressComponent={<LinearProgress id="stream-listing" />}
            columns={this.defineColumns()}
            contextActions={this.defineContextActions()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no stream specifications to display" icon={<StreamIcon size={150} />} />}
            onRowClicked={this.handleRowClicked}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withStreamSpec,
  connect(null, actions),
)(StreamList);

