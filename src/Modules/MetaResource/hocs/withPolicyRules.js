import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default function withPolicyRules(BaseComponent) {
  class PolicyRules extends Component {
    static displayName = 'PolicyRules (HOC)';

    static propTypes = {
      policyRulesActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { policyRulesActions } = this.props;

      policyRulesActions.unloadPolicyRules();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    policyRules: state.metaResource.policyRules.policyRules,
    policyRulesPending: state.metaResource.policyRules.pending,
  });

  const mapDispatchToProps = dispatch => ({
    policyRulesActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'PolicyRules'),
      createRequestAction(['delete'], 'PolicyRule'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(PolicyRules);
}
