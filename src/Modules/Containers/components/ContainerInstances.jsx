import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Timestamp } from 'components/TableCells';
import { Title } from 'components/Typography';
import { FontIcon, Button } from 'react-md';
import { getLastFromSplit } from 'util/helpers/strings';
// import ExpandableLogs from './ExpandableLogs';

const ContainerInstances = ({ containerModel, fqon }) => {
  const providerType = getLastFromSplit(containerModel.properties.provider.resource_type);
  const columns = [
    {
      width: '225px',
      ignoreRowClick: true,
      cell: row => (
        <Button
          flat
          primary
          iconChildren="subject"
          to={{
            pathname: '/logs',
            search: `?name=${containerModel.name} - ${row.host}&fqon=${fqon}&providerId=${containerModel.properties.provider.id}&providerType=${providerType}&logType=container&logId=${row.id}`
          }}
          target="_blank"
          component={Link}
        >
          Expand Log
        </Button>
      ),
    },
    {
      name: 'Container IPs',
      selector: 'ipAddresses',
      right: true,
      cell: row => row.ipAddresses && row.ipAddresses.map((ip, idx) => <div key={idx}>{ip.ipAddress}</div>)
    },
    {
      name: 'Host',
      selector: 'host',
      sortable: true,
      right: true,
    },
    {
      name: 'Host Port',
      right: true,
      cell: row => row.ports && row.ports.map((port, idx) => <div key={idx}>{port}</div>)
    },
    {
      name: 'Started',
      selector: 'startedAt',
      sortable: true,
      wrap: true,
      cell: row => <Timestamp timestamp={row.startedAt} />
    },
  ];

  return (
    <DataTable
      data={containerModel.properties.instances}
      columns={columns}
      sortIcon={<FontIcon>arrow_downward</FontIcon>}
      defaultSortField="startedAt"
      noDataComponent={<Title light>There are no instances running</Title>}
      // expandableRows
      // expandableRowsComponent={
      //   <ExpandableLogs providerType={providerType} containerModel={containerModel} fqon={fqon} />
      // }
      noHeader
    />
  );
};

ContainerInstances.propTypes = {
  containerModel: PropTypes.object.isRequired,
  fqon: PropTypes.string.isRequired,
};

export default ContainerInstances;
