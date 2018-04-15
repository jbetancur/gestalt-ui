import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withStreamSpec(BaseComponent) {
  class Stream extends Component {
    static displayName = 'SreamSpec(HOC)';
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
  });

  const mapDispatchToProps = dispatch => ({
    streamSpecActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'StreamSpec'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Stream);
}
