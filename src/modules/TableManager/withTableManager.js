import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import actions from './actions';

/**
 * Higher-order component (HOC)
 */
export default function WithTableManager(WrappedTableManager) {
  class Resource extends PureComponent {
    static propTypes = {
      tableManager: PropTypes.object.isRequired,
      tableActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { tableActions } = this.props;
      tableActions.clearTableSelected();
      tableActions.clearTableSort();
    }

    getTableSortedItems = (model, defaultKey) =>
      orderBy(model, this.props.tableManager.tableSortKey || defaultKey, this.props.tableManager.tableSortOrder);

    render() {
      return <WrappedTableManager {...this.props} getTableSortedItems={this.getTableSortedItems} />;
    }
  }

  function mapStateToProps(state) {
    const { tableManager } = state;

    return {
      tableManager: {
        tableSortKey: tableManager.tableSort.key,
        tableSortOrder: tableManager.tableSort.order,
        tableSelected: tableManager.tableSelected,
      }
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      tableActions: bindActionCreators(actions, dispatch)
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)((Resource));
}
