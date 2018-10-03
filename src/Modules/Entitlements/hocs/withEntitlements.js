import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default () => (BaseComponent) => {
  class Entitlements extends Component {
    static displayName = 'Entitlements(HOC)';

    static propTypes = {
      entitlementActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { entitlementActions } = this.props;

      entitlementActions.unloadEntitlements();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    entitlements: state.entitlements.entitlements.entitlements,
    entitlementsPending: state.entitlements.entitlements.pending,
  });

  const mapDispatchToProps = dispatch => ({
    entitlementActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'Entitlements'),
      createRequestAction(['update'], 'Entitlement'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Entitlements);
};
