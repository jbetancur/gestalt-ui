import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default () => (BaseComponent) => {
  class Volume extends Component {
    static displayName = 'Volume (HOC)';

    static propTypes = {
      volumeActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { volumeActions } = this.props;

      volumeActions.unloadVolume();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    volume: state.metaResource.volume.volume,
    volumePending: state.metaResource.volume.pending,
  });

  const mapDispatchToProps = dispatch => ({
    volumeActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Volume'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Volume);
};
