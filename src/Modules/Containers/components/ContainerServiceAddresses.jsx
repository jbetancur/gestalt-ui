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
    return this.props.containerModel.properties.port_mappings.map((port, i) => (
      <TableRow key={i}>
        <TableColumn>{port.service_address && port.service_address.host}</TableColumn>
        <TableColumn>{port.service_address && port.service_address.port}</TableColumn>
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
        {this.props.containerModel.properties.port_mappings.some(prop => prop.service_address) ? this.renderServiceAddressesTable() : null}
      </div>
    );
  }
}

export default ContainerServiceAddresses;
