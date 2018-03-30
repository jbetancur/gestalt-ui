import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Timestamp } from 'components/TableCells';
import { FontIcon, Button } from 'react-md';
import { getLastFromSplit } from 'util/helpers/strings';

const ContainerInstances = ({ instances, containerModel, fqon }) => {
  const columns = [
    {
      ignoreRowClick: true,
      cell: row => (
        <Button
          flat
          primary
          to={{
            pathname: '/logs',
            search: `?name=${containerModel.name} - ${row.host}&fqon=${fqon}&providerId=${containerModel.properties.provider.id}&providerType=${getLastFromSplit(containerModel.properties.provider.resource_type)}&logType=container&logId=${row.id}`
          }}
          target="_blank"
          component={Link}
        >
          View Log
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
      cell: row => <Timestamp timestamp={row.startedAt} />
    },
  ];

  return (
    <DataTable
      data={instances}
      columns={columns}
      sortIcon={<FontIcon>arrow_downward</FontIcon>}
      defaultSortField="startedAt"
      noHeader
    />
  );
};

ContainerInstances.propTypes = {
  instances: PropTypes.array,
  containerModel: PropTypes.object.isRequired,
  fqon: PropTypes.object.isRequired,
};

ContainerInstances.defaultProps = {
  instances: [],
};

export default ContainerInstances;

