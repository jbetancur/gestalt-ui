import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { Title } from 'components/Typography';
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
    grow: 3,
  },
  {
    name: 'Port',
    selector: 'lb_port',
    sortable: true,
    right: true,
    grow: 0,
  },
  {
    name: 'Protocol',
    selector: 'service_address.protocol',
    sortable: true,
    grow: 0,
    format: row => row.service_address && row.service_address.protocol.toUpperCase(),
  },
];

const ContainerServiceAddresses = ({ portMappings }) => (
  <DataTable
    data={portMappings.filter(p => p.service_address)}
    columns={columns}
    sortIcon={<FontIcon>arrow_downward</FontIcon>}
    defaultSortField="name"
    noDataComponent={<Title light>There are no port mappings configured</Title>}
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
