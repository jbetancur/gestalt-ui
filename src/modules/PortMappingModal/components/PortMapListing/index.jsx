import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'react-md/lib/FontIcons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow } from 'components/Tables';
import { FieldRemoveButton } from 'components/Buttons';
import A from 'components/A';

class PortMapListing extends Component {
  static propTypes = {
    portMappings: PropTypes.array.isRequired,
    mergePortMappings: PropTypes.array,
    addPortmapping: PropTypes.func.isRequired,
    removePortmapping: PropTypes.func.isRequired,
    unloadPortmappings: PropTypes.func.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    mergePortMappings: [],
    editMode: false,
  };

  componentDidMount() {
    this.props.mergePortMappings.forEach(m => this.props.addPortmapping(m));
  }

  componentWillUnmount() {
    // if we dont unload state in editMode, merged entries from the container begin to stack up on unload
    if (this.props.editMode) {
      this.props.unloadPortmappings();
    }
  }

  renderRows(portMappings) {
    return portMappings.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.name}</TableColumn>
        <TableColumn>{item.protocol}</TableColumn>
        <TableColumn>{item.expose_endpoint && <FontIcon>checked</FontIcon>}</TableColumn>
        <TableColumn>{item.service_port}</TableColumn>
        <TableColumn>{item.container_port}</TableColumn>
        <TableColumn >{item.virtual_hosts && item.virtual_hosts.map(host => <div><A href={`https://${host}`} target="_blank" rel="noopener noreferrer">{`https://${host}`}</A></div>)}</TableColumn>
        <TableColumn containsButtons><FieldRemoveButton onClick={() => this.props.removePortmapping(item)} inTable /></TableColumn>
      </TableRow>
    ));
  }

  render() {
    const portMappings = this.props.portMappings;

    return (
      <DataTable plain>
        {portMappings.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn>Name</TableColumn>
              <TableColumn>Protocol</TableColumn>
              <TableColumn>Expose Service</TableColumn>
              <TableColumn>Service Port</TableColumn>
              <TableColumn>Container Port</TableColumn>
              <TableColumn>Virtual Hosts</TableColumn>
              <TableColumn />
            </TableRow>
          </TableHeader>}
        <TableBody>
          {this.renderRows(portMappings)}
        </TableBody>
      </DataTable>
    );
  }
}

export default PortMapListing;
