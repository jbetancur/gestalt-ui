import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { MenuButton } from 'react-md';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import InsertChart from '@material-ui/icons/InsertChart';
import DataTable from 'react-data-table-component';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import { ActionsMenu } from 'Modules/Actions';
import { StatusBubble } from 'components/Status';
import { Timestamp } from 'components/TableCells';
import { Title } from 'components/Typography';
import { FlatButton } from 'components/Buttons';
import StreamInstanceModal from './StreamInstanceModal';

const translateRetries = (value) => {
  if (value === -1) {
    return '∞';
  }

  return value;
};

const StreamInstances = ({ fqon, streamSpec, streamInstances, providerActions }) => {
  const { showModal } = useContext(ModalContext);
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
        <FlatButton
          color="primary"
          label="View Metrics"
          icon={<InsertChart fontSize="small" />}
          onClick={() => showModal(StreamInstanceModal, {
            fqon,
            streamId: streamSpec.id,
            persistenceId: row.persistenceId,
          })}
          disabled={!(row.status === 'active' || row.status === 'starting')}
        />
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
      sortIcon={<ArrowDownIcon />}
      defaultSortField="startTime"
      defaultSortAsc={false}
      noDataComponent={<Title light>There are no stream instances running</Title>}
    />
  );
};

StreamInstances.propTypes = {
  fqon: PropTypes.string.isRequired,
  streamSpec: PropTypes.object.isRequired,
  streamInstances: PropTypes.array.isRequired,
  providerActions: PropTypes.array.isRequired,
};

export default StreamInstances;
