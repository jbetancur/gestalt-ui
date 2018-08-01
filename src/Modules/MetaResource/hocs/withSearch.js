import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

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
    userSearchResults: state.metaResource.searchUsers.searchUsers,
    userSearchPending: state.metaResource.searchUsers.pending,
    assetSearchResults: state.metaResource.searchAssets.searchAssets,
    assetSearchPending: state.metaResource.searchAssets.pending,
  });

  const mapDispatchToProps = dispatch => ({
    searchActions: bindActionCreators(Object.assign({},
      createRequestAction(['do'], 'SearchAssets'),
      createRequestAction(['do'], 'SearchUsers'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Search);
};
