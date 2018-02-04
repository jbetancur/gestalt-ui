import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow } from 'components/Tables';

class ContainerServiceAddresses extends PureComponent {
  static propTypes = {
    serviceAddresses: PropTypes.array.isRequired,
  };

  renderServiceAddressesRows() {
    const { serviceAddresses } = this.props;

    return serviceAddresses.map((port, i) => (
      port.service_address &&
      <TableRow key={i}>
        <TableColumn>
          {port.service_address.host}
        </TableColumn>
        <TableColumn>
          {port.service_address.port === 0 ? 'auto' : port.service_address.port}
        </TableColumn>
        <TableColumn>
          {port.service_address.protocol}
        </TableColumn>
      </TableRow>
    ));
  }

  render() {
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn>Host</TableColumn>
            <TableColumn>Service Port</TableColumn>
            <TableColumn>Protocol</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.renderServiceAddressesRows()}
        </TableBody>
      </DataTable>
    );
  }
}

export default ContainerServiceAddresses;
