import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Volumes extends Component {
    static displayName = 'Volumes (HOC)';

    static propTypes = {
      volumesActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { volumesActions } = this.props;

        volumesActions.unloadVolumes();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    volumes: state.metaResource.volumes.volumes,
    volumesPending: state.metaResource.volumes.pending,
  });

  const mapDispatchToProps = dispatch => ({
    volumesActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'Volumes'),
      createRequestAction(['delete'], 'Volume'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Volumes);
};
