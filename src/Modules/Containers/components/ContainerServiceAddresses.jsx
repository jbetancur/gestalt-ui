import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { Title } from 'components/Typography';
import { FontIcon } from 'react-md';
import AddressCell from './AddressCell';

const columns = [
  {
    name: 'Exposure Type',
    selector: 'type',
    sortable: true,
  },
  {
    name: 'Port Name',
    selector: 'name',
    sortable: true,
  },
  {
    name: 'Protocol',
    selector: 'protocol',
    sortable: true,
  },
  {
    name: 'Service Address',
    selector: 'service_address.host',
    sortable: true,
    grow: 5,
    wrap: true,
    cell: row => <AddressCell address={row.service_address} />
  },
  {
    name: 'Load Balancer',
    selector: 'lb_address.host',
    sortable: true,
    grow: 2,
    cell: row => <AddressCell address={row.lb_address} />
  },
  {
    name: 'Virtual Hosts',
    selector: 'service_address.virtual_hosts',
    sortable: true,
    cell: row => row.expose_endpoint && row.virtual_hosts && row.virtual_hosts.map((host, index) => <div key={`${host}-${index}`}>{host}</div>),
  },
];

const ContainerServiceAddresses = ({ portMappings }) => (
  <DataTable
    data={portMappings.filter(port => port.service_address || (port.service_address && port.lb_address))}
    columns={columns}
    sortIcon={<FontIcon>arrow_downward</FontIcon>}
    defaultSortField="type"
    noDataComponent={<Title light>There are no port mappings configured</Title>}
    noHeader
    pagination
  />
);

ContainerServiceAddresses.propTypes = {
  portMappings: PropTypes.array,
};

ContainerServiceAddresses.defaultProps = {
  portMappings: [],
};

export default ContainerServiceAddresses;
