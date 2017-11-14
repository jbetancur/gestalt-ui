import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Button, ClipboardButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableColumnTimestamp } from 'components/Tables';

class ContainerInstances extends PureComponent {
  static propTypes = {
    containerModel: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    providerType: PropTypes.string,
  };

  static defaultProps = {
    providerType: '',
  };

  constructor(props) {
    super(props);
  }

  renderInstancesRows() {
    const { match, containerModel, providerType } = this.props;

    return containerModel.properties.instances.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>
          {providerType === 'Kubernetes' &&
          <ClipboardButton
            showUUID={false}
            text={`fog console ${match.params.environmentId} ${item.id}`}
            tooltipLabel="Copy console access cmd"
            tooltipPosition="right"
          />}
          <Button
            icon
            iconChildren="subject"
            tooltipLabel="View Log"
            tooltipPosition="right"
            to={{
              pathname: '/logs',
              search: `?name=${containerModel.name} - ${item.host}&fqon=${match.params.fqon}&providerId=${containerModel.properties.provider.id}&logType=container&logId=${item.id}`
            }}
            target="_blank"
            component={Link}
          >
            View Log
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
        <TableColumnTimestamp timestamp={item.startedAt} />
      </TableRow>
    ));
  }

  renderInstancesTable() {
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn style={{ width: '99px' }} />
            <TableColumn>Host Address</TableColumn>
            <TableColumn>Addresses</TableColumn>
            <TableColumn>Host Port</TableColumn>
            <TableColumn>Started</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.renderInstancesRows()}
        </TableBody>
      </DataTable>
    );
  }

  render() {
    return (
      <div>
        {(this.props.containerModel.properties.instances && Object.keys(this.props.containerModel.properties.instances).length) ? this.renderInstancesTable() : null}
      </div>
    );
  }
}

export default withRouter(ContainerInstances);
