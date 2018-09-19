import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

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
    sync: state.hierarchy.sync.sync,
    syncPending: state.hierarchy.sync.pending,
  });

  const mapDispatchToProps = dispatch => ({
    syncActions: bindActionCreators(Object.assign({},
      createRequestAction(['do'], 'Sync'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Sync);
}
