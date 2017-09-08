import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, ClipboardButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class ContainerDetails extends PureComponent {
  static propTypes = {
    containerModel: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    providerType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderInstancesRows() {
    const { match, containerModel, providerType } = this.props;

    return containerModel.properties.instances.map((item, i) => (
      <TableRow key={i}>
        <TableColumn containsButtons>
          {providerType === 'Kubernetes' && <ClipboardButton
            showUUID={false}
            text={`kubectl exec --namespace ${match.params.environmentId} -ti ${item.id} -- /bin/bash`}
            tooltipLabel="Copy console access cmd"
            tooltipPosition="right"
          />}
          <Button
            icon
            tooltipLabel="View Log"
            tooltipPosition="right"
            to={{
              pathname: '/logs',
              search: `?name=${containerModel.name} - ${item.host}&fqon=${match.params.fqon}&providerId=${containerModel.properties.provider.id}&logType=container&logId=${item.id}`
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
        <TableCardHeader title={<span className="gf-headline">{`Instances (${this.props.containerModel.properties.instances.length}/${this.props.containerModel.properties.num_instances})`}</span>} />
        <DataTable plain>
          <TableHeader>
            <TableRow autoAdjust={false}>
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

  render() {
    return (
      <div>
        {(this.props.containerModel.properties.instances && Object.keys(this.props.containerModel.properties.instances).length) ? this.renderInstancesTable() : null}
      </div>
    );
  }
}

export default ContainerDetails;
