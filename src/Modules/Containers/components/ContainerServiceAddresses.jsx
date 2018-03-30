import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { FontIcon } from 'react-md';

const columns = [
  {
    name: 'Port Name',
    selector: 'name',
    sortable: true,
  },
  {
    name: 'Service Address',
    selector: 'service_address.host',
    sortable: true,
  },
  {
    name: 'Port',
    selector: 'lb_port',
    sortable: true,
    right: true,
  },
  {
    name: 'Protocol',
    selector: 'service_address.protocol',
    sortable: true,
    format: row => row.service_address && row.service_address.protocol.toUpperCase(),
  },
];

const ContainerServiceAddresses = ({ portMappings }) => (
  <DataTable
    data={portMappings.filter(p => p.service_address)}
    columns={columns}
    sortIcon={<FontIcon>arrow_downward</FontIcon>}
    defaultSortField="name"
    noHeader
  />
);

ContainerServiceAddresses.propTypes = {
  portMappings: PropTypes.array,
};

ContainerServiceAddresses.defaultProps = {
  portMappings: [],
};

export default ContainerServiceAddresses;
