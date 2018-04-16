import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withstreamSpecs(BaseComponent) {
  class StreamSpecs extends Component {
    static displayName = 'StreamSpecs(HOC)';
    static propTypes = {
      streamSpecsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { streamSpecsActions } = this.props;

      streamSpecsActions.unloadStreamSpecs();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    streamSpecs: state.metaResource.streamSpecs.streamSpecs,
    streamSpecsPending: state.metaResource.streamSpecs.pending,
  });

  const mapDispatchToProps = dispatch => ({
    streamSpecsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'StreamSpecs'),
      createRequestAction(['delete'], 'StreamSpec'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(StreamSpecs);
}
