import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class ContainerDetails extends PureComponent {
  static propTypes = {
    container: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderInstancesRows() {
    const { match, container } = this.props;

    return container.properties.instances.map((item, i) => (
      <TableRow key={i}>
        <TableColumn containsButtons>
          <Button
            icon
            tooltipLabel="View Log"
            tooltipPosition="right"
            to={{
              pathname: '/logs',
              search: `?name=${container.name} - ${item.host}&fqon=${match.params.fqon}&providerId=${container.properties.provider.id}&logType=container&logId=${item.id}`
            }}
            target="_blank"
            component={Link}
          >subject
          </Button>
        </TableColumn>
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
        <TableCardHeader title={<span className="gf-headline">{`Instances (${this.props.container.properties.instances.length}/${this.props.container.properties.num_instances})`}</span>} />
        <DataTable plain>
          <TableHeader>
            <TableRow>
              <TableColumn />
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
        <TableCardHeader title={<span className="gf-headline">Service Instances</span>} />
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
