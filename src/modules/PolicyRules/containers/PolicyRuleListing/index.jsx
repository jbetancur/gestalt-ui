import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PolicyRuleItem from '../../components/PolicyRuleItem';

import * as actions from '../../actions';

class PolicyRuleListing extends Component {
  static propTypes = {
    fetchPolicyRules: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchPolicyRules(params.fqon, params.policyId);
  }

  componentWillUnmount() {
    const { onUnloadListing, clearSelected } = this.props;
    onUnloadListing();
    clearSelected();
  }

  render() {
    return <PolicyRuleItem {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    policyRules: state.policyRules.fetchAll.policyRules,
    pending: state.policyRules.fetchAll.pending,
    selectedPolicyRules: state.policyRules.selectedPolicyRules,
  };
}

export default connect(mapStateToProps, actions)(PolicyRuleListing);
