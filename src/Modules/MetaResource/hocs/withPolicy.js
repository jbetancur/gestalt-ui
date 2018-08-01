import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withPolicy(BaseComponent) {
  class Policy extends Component {
    static displayName = 'Policy (HOC)';

    static propTypes = {
      policyActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { policyActions } = this.props;

      policyActions.unloadPolicy();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    policy: state.metaResource.policy.policy,
    policyPending: state.metaResource.policy.pending,
  });

  const mapDispatchToProps = dispatch => ({
    policyActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Policy'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Policy);
}
