import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
// import Button from 'react-md/lib/Buttons/Button';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class ContainerDetails extends PureComponent {
  static propTypes = {
    container: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderInstancesRows() {
    return this.props.container.properties.instances.map((item, i) => (
      <TableRow key={i}>
        {/* <TableColumn containsButtons>
          <Button
            icon
            tooltipLabel="Logs"
            tooltipPosition="right"
            to={`containers/${this.props.container.id}/logs`}
            target="_blank"
            component={Link}
          >subject
          </Button>
        </TableColumn> */}
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
        <TableCardHeader title={<h3>{`Instances (${this.props.container.properties.instances.length}/${this.props.container.properties.num_instances})`}</h3>} />
        <DataTable plain>
          <TableHeader>
            <TableRow>
              {/* <TableColumn /> */}
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
        <TableCardHeader title={<h3>Service Instances</h3>} />
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
        {(this.props.container.properties.instances && Object.keys(this.props.container.properties.instances).length) && this.renderInstancesTable()}
        {this.props.container.properties.port_mappings.some(prop => prop.service_address) && this.renderServiceAddressesTable()}
      </div>
    );
  }
}

export default ContainerDetails;
