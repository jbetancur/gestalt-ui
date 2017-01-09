import React, { Component, PropTypes } from 'react';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import { sort } from 'util/helpers/lists';

class TableSortColumn extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      sortedList: sort(props.list, props.sortBy, true).map(item => ({ ...item })),
      [`${props.sortBy}Sorted`]: true
    };
  }

  sort() {
    const { list, sortBy } = this.props;
    const key = sortBy;
    const sorted = !this.state[`${key}Sorted`];

    this.setState({
      sortedList: sort(list, key, sorted),
      [`${key}Sorted`]: sorted,
    });
  }

  render() {
    return (
      <TableColumn sorted={`${this.props.sortBy}Sorted`} onClick={typeof `${this.props.sortBy}Sorted` === 'boolean' ? this.sort : null}>{this.props.name}</TableColumn>
    );
  }
}

export default TableSortColumn;
