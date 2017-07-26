import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldRemoveButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow } from 'components/Tables';

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

  componentDidMount() {
    this.props.mergeVolumes.forEach(vol => this.props.addVolume(vol));
  }

  componentWillUnmount() {
    // if we dont unload state in editMode, merged entries from the container begin to stack up on unload
    if (this.props.editMode) {
      this.props.unloadVolumes();
    }
  }

  renderRows(volumes) {
    return volumes.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.type || item.plugin}</TableColumn>
        <TableColumn>{item.mode}</TableColumn>
        <TableColumn>{item.host_path}</TableColumn>
        <TableColumn>{item.container_path}</TableColumn>
        <TableColumn>{item.name}</TableColumn>
        <TableColumn>{item.persistent && item.persistent.size}</TableColumn>
        <TableColumn containsButtons><FieldRemoveButton onClick={() => this.props.removeVolume(item)} inTable /></TableColumn>
      </TableRow>
    ));
  }

  render() {
    const volumes = this.props.volumes;

    return (
      <DataTable plain>
        {volumes.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn>Type</TableColumn>
              <TableColumn>Mode</TableColumn>
              <TableColumn>Host Path (Host Only)</TableColumn>
              <TableColumn>Container Path</TableColumn>
              <TableColumn>Volume Name</TableColumn>
              <TableColumn>Size (MiB)</TableColumn>
              <TableColumn />
            </TableRow>
          </TableHeader>}
        <TableBody>
          {this.renderRows(volumes)}
        </TableBody>
      </DataTable>
    );
  }
}

export default VolumeListing;
