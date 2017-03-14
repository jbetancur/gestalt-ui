import React, { Component, PropTypes } from 'react';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import { FieldRemoveButton } from 'components/Buttons';

class VolumeListing extends Component {
  static propTypes = {
    networks: PropTypes.array.isRequired,
    mergeNetworks: PropTypes.array,
    addNetwork: PropTypes.func.isRequired,
    removeNetwork: PropTypes.func.isRequired,
    unloadNetworks: PropTypes.func.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    mergeNetworks: [],
    editMode: false,
  };

  componentWillMount() {
    this.props.mergeNetworks.forEach(port => this.props.addNetwork(port));
  }

  componentWillUnmount() {
    // if we dont unload state in editMode, merged entries from the container begin to stack up on unload
    if (this.props.editMode) {
      this.props.unloadNetworks();
    }
  }

  remove(volume) {
    this.props.removeNetwork(volume);
  }

  renderRows() {
    return this.props.networks.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.name}</TableColumn>
        <TableColumn>{item.protocol}</TableColumn>
        <TableColumn><Checkbox style={{ height: '1.4em' }} defaultChecked={item.expose_endpoint} disabled /></TableColumn>
        <TableColumn>{item.service_port}</TableColumn>
        <TableColumn>{item.container_port}</TableColumn>
        <TableColumn><FieldRemoveButton onClick={() => this.remove(item)} /></TableColumn>
      </TableRow>
    ));
  }

  render() {
    return (
      <DataTable plain>
        {this.props.networks.length ?
          <TableHeader>
            <TableRow>
              <TableColumn>Name</TableColumn>
              <TableColumn>Protocol</TableColumn>
              <TableColumn>Expose Endpoint</TableColumn>
              <TableColumn>Service Port</TableColumn>
              <TableColumn>Container Port</TableColumn>
              <TableColumn />
            </TableRow>
          </TableHeader> : null}
        <TableBody>
          {this.renderRows()}
        </TableBody>
      </DataTable>
    );
  }
}

export default VolumeListing;
