import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withSecret(BaseComponent) {
  class Secret extends Component {
    static displayName = 'Secret (HOC)';

    static propTypes = {
      secretActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { secretActions } = this.props;

      secretActions.unloadSecret();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    secret: state.metaResource.secret.secret,
    secretPending: state.metaResource.secret.pending,
  });

  const mapDispatchToProps = dispatch => ({
    secretActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Secret'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Secret);
}
