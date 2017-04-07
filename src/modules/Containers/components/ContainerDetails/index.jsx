import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';

class ContainerDetails extends Component {
  static propTypes = {
    container: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderInstancesRows() {
    return this.props.container.properties.instances.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.host}</TableColumn>
        <TableColumn>
          {item.ipAddresses && item.ipAddresses.map((ip, idx) => <div key={idx}>{ip.ipAddress}</div>)}
        </TableColumn>
        <TableColumn>
          {/* TODO: <a rel="noopener noreferrer" target="_blank" href={`http://${item.host}:${port}`}>{port}</a> */}
          {item.ports && item.ports.map((port, idx) => <div key={idx}>{port}</div>)}
        </TableColumn>
      </TableRow>
    ));
  }

  renderInstancesTable() {
    return (
      <div>
        <TableCardHeader title={`Instances (${this.props.container.properties.instances.length}/${this.props.container.properties.num_instances})`} />
        <DataTable plain>
          <TableHeader>
            <TableRow>
              <TableColumn>Host Address</TableColumn>
              <TableColumn>Container Addresses</TableColumn>
              <TableColumn>Host Port</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.renderInstancesRows()}
          </TableBody>
        </DataTable>
      </div>
    );
  }

  renderServiceAddressesRows() {
    return this.props.container.properties.port_mappings.map((port, i) => (
      <TableRow key={i}>
        <TableColumn>{port.service_address && port.service_address.host}</TableColumn>
        <TableColumn>{port.service_address && port.service_address.port}</TableColumn>
        <TableColumn>{port.service_address && port.service_address.protocol}</TableColumn>
      </TableRow>
    ));
  }

  renderServiceAddressesTable() {
    return (
      <div>
        <TableCardHeader title="Service Addresses" />
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
      </div>
    );
  }

  render() {
    return (
      <div>
        {(this.props.container.properties.instances && Object.keys(this.props.container.properties.instances).length) ? this.renderInstancesTable() : null}
        {this.props.container.properties.port_mappings.some(prop => prop.service_address) ? this.renderServiceAddressesTable() : null}
      </div>
    );
  }
}

export default ContainerDetails;
