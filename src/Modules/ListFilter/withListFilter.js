import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './actions';

export default function withListFilter(BaseComponent) {
  class ListFilters extends PureComponent {
    static propTypes = {
      listFilterActions: PropTypes.object.isRequired,
    };

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    listFilter: {
      filterValue: state.listfilter.filter.filter,
      filterTextValue: state.listfilter.filter.filterText,
      isFiltering: state.listfilter.filter.isFiltering,
    }
  });

  const mapDispatchToProps = dispatch => ({
    listFilterActions: bindActionCreators(actions, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(ListFilters);
}
