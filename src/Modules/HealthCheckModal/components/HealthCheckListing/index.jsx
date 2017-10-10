import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'react-md/lib/FontIcons';
import { FieldRemoveButton } from 'components/Buttons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow } from 'components/Tables';

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

  componentDidMount() {
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

  renderRows(healthChecks) {
    return healthChecks.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.protocol}</TableColumn>
        <TableColumn>{item.grace_period_seconds}</TableColumn>
        <TableColumn>{item.interval_seconds}</TableColumn>
        <TableColumn>{item.timeout_seconds}</TableColumn>
        <TableColumn>{item.max_consecutive_failures}</TableColumn>
        <TableColumn>{item.path}</TableColumn>
        <TableColumn>{item.command}</TableColumn>
        <TableColumn>{item.port}</TableColumn>
        <TableColumn>{item.port_index}</TableColumn>
        <TableColumn>{item.ignore_http_1xx && <FontIcon>checked</FontIcon>}</TableColumn>
        <TableColumn><FieldRemoveButton onClick={() => this.remove(item)} inTable /></TableColumn>
      </TableRow>
    ));
  }

  render() {
    const { healthChecks } = this.props;

    return (
      <DataTable plain>
        {healthChecks.length > 0 &&
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
          </TableHeader>}
        <TableBody>
          {this.renderRows(healthChecks)}
        </TableBody>
      </DataTable>
    );
  }
}

export default HealthCheckListing;
