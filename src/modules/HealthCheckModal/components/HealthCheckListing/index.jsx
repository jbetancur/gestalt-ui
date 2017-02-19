import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import FontIcon from 'react-md/lib/FontIcons';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

const EnhancedTableColumn = styled(TableColumn)`
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  padding-right: 1px !important;
  padding-left: 5px !important;
  height: 3.8em;
  vertical-align: middle !important;
`;

class HealthCheckListing extends Component {
  static propTypes = {
    healthChecks: PropTypes.array.isRequired,
    mergeHealthChecks: PropTypes.array,
    addHealthCheck: PropTypes.func.isRequired,
    removeHealthCheck: PropTypes.func.isRequired,
    unloadHealthChecks: PropTypes.func.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    mergeHealthChecks: [],
    editMode: false,
  };

  componentWillMount() {
    this.props.mergeHealthChecks.forEach(hc => this.props.addHealthCheck(hc));
  }

  componentWillUnmount() {
    // if we dont unload state in editMode, merged entries from the container begin to stack up on unload
    if (this.props.editMode) {
      this.props.unloadHealthChecks();
    }
  }

  remove(volume) {
    this.props.removeHealthCheck(volume);
  }

  renderRows() {
    return this.props.healthChecks.map((item, i) => (
      <TableRow key={i}>
        <EnhancedTableColumn>{item.protocol}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.grace_period_seconds}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.interval_seconds}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.timeout_seconds}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.max_consecutive_failures}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.path}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.command}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.port}</EnhancedTableColumn>
        <EnhancedTableColumn>{item.port_index}</EnhancedTableColumn>
        <EnhancedTableColumn><Checkbox style={{ height: '1.4em' }} defaultChecked={item.ignore_http_1xx} disabled /></EnhancedTableColumn>
        <EnhancedTableColumn><FontIcon onClick={() => this.remove(item)} style={{ color: 'red' }}>remove_circle_outline</FontIcon></EnhancedTableColumn>
      </TableRow>
    ));
  }

  render() {
    return (
      <DataTable plain>
        {this.props.healthChecks.length ?
          <TableHeader>
            <TableRow>
              <TableColumn>Protocol</TableColumn>
              <TableColumn>Grace Period</TableColumn>
              <TableColumn>Interval</TableColumn>
              <TableColumn>Timeout</TableColumn>
              <TableColumn>Max Failures</TableColumn>
              <TableColumn>Path</TableColumn>
              <TableColumn>Command</TableColumn>
              <TableColumn>Port</TableColumn>
              <TableColumn>PortIndex</TableColumn>
              <TableColumn>Ignore 100-199</TableColumn>
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

export default HealthCheckListing;
