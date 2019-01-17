import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FontIcon, MenuButton } from 'react-md';
import DataTable from 'react-data-table-component';
import { ActionsMenu } from 'Modules/Actions';
import { StatusBubble } from 'components/Status';
import { Timestamp } from 'components/TableCells';
import { Title } from 'components/Typography';
import { Button } from 'components/Buttons';
import actions from '../actions';

const translateRetries = (value) => {
  if (value === -1) {
    return '∞';
  }

  return value;
};

const StreamInstances = ({ fqon, streamSpec, streamInstances, providerActions, showModal, onRefresh }) => {
  const columns = [
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: row => (
        <StatusBubble status={row.status} />
      ),
    },
    {
      name: 'Retries',
      selector: 'retries',
      sortable: true,
      format: row => translateRetries(row.retries),
    },
    {
      name: 'Start Time',
      selector: 'startTime',
      sortable: true,
      wrap: true,
      cell: row => <Timestamp timestamp={row.startTime} />,
    },
    {
      width: '200px',
      button: true,
      ignoreRowClick: true,
      cell: row => (
        <Button
          flat
          primary
          iconChildren="insert_chart"
          onClick={() => showModal({ fqon, streamId: streamSpec.id, persistenceId: row.persistenceId })}
          disabled={row.status !== 'active'}
        >
          View Metrics
        </Button>
      ),
    },
  ];

  if (providerActions.length) {
    columns.unshift({
      width: '56px',
      button: true,
      allowOverflow: true,
      ignoreRowClick: true,
      cell: row => (
        <ActionsMenu
          icon
          primary
          resource={row}
          actionList={providerActions}
          fqon={fqon}
          position={MenuButton.Positions.TOP_LEFT}
          anchor={{
            x: MenuButton.HorizontalAnchors.INNER_LEFT,
            y: MenuButton.VerticalAnchors.OVERLAP,
          }}
          disabled={!(row.status === 'active' || row.status === 'starting')}
        />
      )
    });
  }

  return (
    <DataTable
      keyField="persistenceId"
      data={streamInstances}
      columns={columns}
      sortIcon={<FontIcon>arrow_downward</FontIcon>}
      defaultSortField="startTime"
      defaultSortAsc={false}
      noDataComponent={<Title light>There are no stream instances running</Title>}
      actions={(
        <Button
          key="streamspec--refresh"
          flat
          iconChildren="refresh"
          onClick={() => onRefresh()}
          primary
        >
          Refresh
        </Button>
      )}
    />
  );
};

StreamInstances.propTypes = {
  fqon: PropTypes.string.isRequired,
  streamSpec: PropTypes.object.isRequired,
  streamInstances: PropTypes.array.isRequired,
  providerActions: PropTypes.array.isRequired,
  showModal: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};

StreamInstances.defaultProps = {
  onRefresh: () => {},
};

export default compose(
  connect(null, actions)
)(StreamInstances);
