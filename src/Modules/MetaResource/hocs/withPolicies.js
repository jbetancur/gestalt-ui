import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withPolicies(BaseComponent) {
  class Policies extends Component {
    static displayName = 'Policies (HOC)';

    static propTypes = {
      policiesActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { policiesActions } = this.props;

      policiesActions.unloadPolicies();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    policies: state.metaResource.policies.policies,
    policiesPending: state.metaResource.policies.pending,
  });

  const mapDispatchToProps = dispatch => ({
    policiesActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'Policies'),
      createRequestAction(['delete'], 'Policy'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Policies);
}
