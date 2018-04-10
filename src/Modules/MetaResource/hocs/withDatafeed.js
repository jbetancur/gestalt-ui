import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions/datafeeds';

export default function withDataFeed(BaseComponent) {
  class DataFeed extends Component {
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
    datafeed: state.metaResource.datafeed.datafeed,
    datafeedPending: state.metaResource.datafeed.pending,
    datafeeds: state.metaResource.datafeeds.datafeeds,
    datafeedsPending: state.metaResource.datafeeds.pending,
  });

  const mapDispatchToProps = dispatch => ({
    datafeedActions: bindActionCreators(actions, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataFeed);
}
