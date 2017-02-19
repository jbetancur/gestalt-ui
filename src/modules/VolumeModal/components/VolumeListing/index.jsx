import React, { Component, PropTypes } from 'react';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import FontIcon from 'react-md/lib/FontIcons';
// import Button from 'react-md/lib/Buttons/Button';

class VolumeListing extends Component {
  static propTypes = {
    volumes: PropTypes.array.isRequired,
    mergeVolumes: PropTypes.array,
    addVolume: PropTypes.func.isRequired,
    removeVolume: PropTypes.func.isRequired,
    unloadVolumes: PropTypes.func.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    mergeVolumes: [],
    editMode: false,
  };

  componentWillMount() {
    this.props.mergeVolumes.forEach(vol => this.props.addVolume(vol));
  }

  componentWillUnmount() {
    // if we dont unload state in editMode, merged entries from the container begin to stack up on unload
    if (this.props.editMode) {
      this.props.unloadVolumes();
    }
  }

  remove(volume) {
    this.props.removeVolume(volume);
  }

  renderRows() {
    return this.props.volumes.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.type || item.plugin}</TableColumn>
        <TableColumn>{item.mode}</TableColumn>
        <TableColumn>{item.host_path}</TableColumn>
        <TableColumn>{item.container_path}</TableColumn>
        <TableColumn>{item.persistent && item.persistent.size}</TableColumn>
        <TableColumn><FontIcon onClick={() => this.remove(item)} style={{ color: 'red' }}>remove_circle_outline</FontIcon></TableColumn>
      </TableRow>
    ));
  }

  render() {
    return (
      <DataTable plain>
        {this.props.volumes.length ?
          <TableHeader>
            <TableRow>
              <TableColumn>Type</TableColumn>
              <TableColumn>Mode</TableColumn>
              <TableColumn>Host Path</TableColumn>
              <TableColumn>Container Path</TableColumn>
              <TableColumn>Size</TableColumn>
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
