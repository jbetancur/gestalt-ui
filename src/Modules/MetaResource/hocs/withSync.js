import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withSync(BaseComponent) {
  class Sync extends Component {
    static displayName = 'Sync(HOC)';

    static propTypes = {
      syncActions: PropTypes.object.isRequired,
    };

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    sync: state.metaResource.sync.sync,
    syncPending: state.metaResource.sync.pending,
  });

  const mapDispatchToProps = dispatch => ({
    syncActions: bindActionCreators(Object.assign({},
      createRequestAction(['do'], 'Sync'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Sync);
}
