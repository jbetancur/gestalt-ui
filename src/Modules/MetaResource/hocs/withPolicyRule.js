import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withPolicyRule(BaseComponent) {
  class PolicyRule extends Component {
    static displayName = 'PolicyRule (HOC)';

    static propTypes = {
      policyRuleActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { policyRuleActions } = this.props;

      policyRuleActions.unloadPolicyRule();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    policyRule: state.metaResource.policyRule.policyRule,
    policyRulePending: state.metaResource.policyRule.pending,
  });

  const mapDispatchToProps = dispatch => ({
    policyRuleActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'PolicyRule'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(PolicyRule);
}
