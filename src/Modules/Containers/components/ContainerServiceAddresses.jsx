import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow } from 'components/Tables';

class ContainerServiceAddresses extends PureComponent {
  static propTypes = {
    containerModel: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderServiceAddressesRows() {
    const { containerModel } = this.props;

    return containerModel.properties.port_mappings.map((port, i) => (
      port.service_address &&
      <TableRow key={i}>
        <TableColumn>{port.service_address && port.service_address.host}</TableColumn>
        <TableColumn numberic>{port.service_address && port.service_address.port}</TableColumn>
        <TableColumn>{port.service_address && port.service_address.protocol}</TableColumn>
      </TableRow>
    ));
  }

  renderServiceAddressesTable() {
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn>Host</TableColumn>
            <TableColumn>Port</TableColumn>
            <TableColumn>Protocol</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.renderServiceAddressesRows()}
        </TableBody>
      </DataTable>
    );
  }

  render() {
    return (
      <div>
        {this.renderServiceAddressesTable()}
      </div>
    );
  }
}

export default ContainerServiceAddresses;
