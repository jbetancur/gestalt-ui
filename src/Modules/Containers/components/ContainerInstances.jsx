import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Button, ClipboardButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableColumnTimestamp } from 'components/Tables';

class ContainerInstances extends PureComponent {
  static propTypes = {
    instances: PropTypes.array.isRequired,
    containerModel: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    providerType: PropTypes.string,
  };

  static defaultProps = {
    providerType: '',
  };

  renderInstancesRows() {
    const { match, instances, providerType, containerModel } = this.props;

    return instances.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>
          {providerType === 'Kubernetes' &&
          <ClipboardButton
            showLabel={false}
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
        <TableColumn>
          {item.ipAddresses && item.ipAddresses.map((ip, idx) => <div key={idx}>{ip.ipAddress}</div>)}
        </TableColumn>
        <TableColumn>{item.host}</TableColumn>
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
            <TableColumn style={{ width: '140px' }} />
            <TableColumn>Container IPs</TableColumn>
            <TableColumn>Host IP</TableColumn>
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
        {(this.props.instances && Object.keys(this.props.instances).length) ? this.renderInstancesTable() : null}
      </div>
    );
  }
}

export default withRouter(ContainerInstances);
