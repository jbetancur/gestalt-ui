import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withSecrets(BaseComponent) {
  class Secrets extends Component {
    static displayName = 'Secrets (HOC)';
    static propTypes = {
      secretsActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { secretsActions } = this.props;

      secretsActions.unloadSecrets();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    secrets: state.metaResource.secrets.secrets,
    secretsPending: state.metaResource.secrets.pending,
  });

  const mapDispatchToProps = dispatch => ({
    secretsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'Secrets'),
      createRequestAction(['delete'], 'Secret'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Secrets);
}
