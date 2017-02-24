import React, { Component, PropTypes } from 'react';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import { map, sortBy } from 'lodash';

class VariablesListing extends Component {
  static propTypes = {
    envMap: PropTypes.object.isRequired
  };

  static defaultProps = {
    envMap: {}
  };

  renderRows() {
    const envVariables = map(this.props.envMap, (value, key) => ({ key, value }));
    const sortedVariables = sortBy(envVariables, 'key');

    return sortedVariables.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.key}</TableColumn>
        <TableColumn>{item.value}</TableColumn>
      </TableRow>
    ));
  }

  renderTable() {
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn>Key</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.renderRows()}
        </TableBody>
      </DataTable>
    );
  }

  render() {
    return (this.props.envMap && Object.keys(this.props.envMap).length) ? this.renderTable() : null;
  }
}

export default VariablesListing;
