import React, { Component, PropTypes } from 'react';
import Card from 'react-md/lib/Cards/Card';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
// import FontIcon from 'react-md/lib/FontIcons';

class ContainerItem extends Component {
  static propTypes = {
    containers: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const containers = this.props.containers.map(container => (
      <TableRow key={container.id}>
        <TableColumn>{container.name}</TableColumn>
        <TableColumn>actions</TableColumn>
        <TableColumn>{container.properties.status}</TableColumn>
        <TableColumn>{container.properties.num_instances}</TableColumn>
        <TableColumn>{container.properties.cpus}</TableColumn>
        <TableColumn>{container.properties.memory}</TableColumn>
        <TableColumn>{container.properties.container_type}</TableColumn>
        <TableColumn>{container.properties.image}</TableColumn>
        <TableColumn>{container.properties.age}</TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Containers"
          />
          {this.props.pending ? <LinearProgress scale={3} centered={true} /> : <DataTable baseId="containers" plain>
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>State</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Instances</TableColumn>
                <TableColumn>CPU</TableColumn>
                <TableColumn>Memory</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Image</TableColumn>
                <TableColumn>Age</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default ContainerItem;

