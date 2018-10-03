import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default () => (BaseComponent) => {
  class Search extends Component {
    static displayName = 'Secret (HOC)';

    static propTypes = {
      searchActions: PropTypes.object.isRequired,
    };

    componentWillUnmount({ unload = true } = {}) {
      if (unload) {
        const { searchActions } = this.props;

        searchActions.unloadSearchAssets();
        searchActions.unloadSearchUsers();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    userSearchResults: state.search.searchUsers.searchUsers,
    userSearchPending: state.search.searchUsers.pending,
    assetSearchResults: state.search.searchAssets.searchAssets,
    assetSearchPending: state.search.searchAssets.pending,
  });

  const mapDispatchToProps = dispatch => ({
    searchActions: bindActionCreators(Object.assign({},
      createRequestAction(['do'], 'SearchAssets'),
      createRequestAction(['do'], 'SearchUsers'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Search);
};
