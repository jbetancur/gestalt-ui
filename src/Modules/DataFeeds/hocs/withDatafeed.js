import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default function withDataFeed(BaseComponent) {
  class DataFeed extends Component {
    static displayName = 'DataFeed(HOC)';

    static propTypes = {
      datafeedActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { datafeedActions } = this.props;

      datafeedActions.unloadDatafeed();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    datafeed: state.dataFeeds.datafeed.datafeed,
    datafeedPending: state.dataFeeds.datafeed.pending,
  });

  const mapDispatchToProps = dispatch => ({
    datafeedActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Datafeed'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataFeed);
}
