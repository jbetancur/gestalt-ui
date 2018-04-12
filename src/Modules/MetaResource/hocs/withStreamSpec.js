import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions/streamSpecs';

export default function withstream(BaseComponent) {
  class Stream extends Component {
    static propTypes = {
      streamSpecActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { streamSpecActions } = this.props;

      streamSpecActions.unloadStreamSpec();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    streamSpec: state.metaResource.streamSpec.streamSpec,
    streamSpecPending: state.metaResource.streamSpec.pending,
    streamSpecs: state.metaResource.streamSpecs.streamSpecs,
    streamSpecsPending: state.metaResource.streamSpecs.pending,
  });

  const mapDispatchToProps = dispatch => ({
    streamSpecActions: bindActionCreators(actions, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Stream);
}
