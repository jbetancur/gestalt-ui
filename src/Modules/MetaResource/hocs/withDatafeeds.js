import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withDataFeeds(BaseComponent) {
  class DataFeeds extends Component {
    static displayName = 'DataFeeds(HOC)';
    static propTypes = {
      datafeedsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { datafeedsActions } = this.props;

      datafeedsActions.unload();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    datafeeds: state.metaResource.datafeeds.datafeeds,
    datafeedsPending: state.metaResource.datafeeds.pending,
  });

  const mapDispatchToProps = dispatch => ({
    datafeedsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'Datafeeds'),
      createRequestAction(['delete'], 'Datafeed'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataFeeds);
}
