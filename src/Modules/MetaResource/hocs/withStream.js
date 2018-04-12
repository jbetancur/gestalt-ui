import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions/streams';

export default function withstream(BaseComponent) {
  class Stream extends Component {
    static propTypes = {
      streamActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { streamActions } = this.props;

      streamActions.unloadStream();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    stream: state.metaResource.stream.stream,
    streamPending: state.metaResource.stream.pending,
    streams: state.metaResource.streams.streams,
    streamsPending: state.metaResource.streams.pending,
  });

  const mapDispatchToProps = dispatch => ({
    streamActions: bindActionCreators(actions, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Stream);
}
