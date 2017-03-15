import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import { FieldRemoveButton } from 'components/Buttons';

const EnhancedTableColumn = styled(TableColumn)`
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  padding-right: 1px !important;
  height: 3.8em;
  vertical-align: middle !important;
`;

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
        <EnhancedTableColumn>{item.type || item.plugin}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.mode}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.host_path}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.container_path}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.persistent && item.persistent.size}</EnhancedTableColumn>
        <EnhancedTableColumn><FieldRemoveButton onClick={() => this.remove(item)} inTable /></EnhancedTableColumn>
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
