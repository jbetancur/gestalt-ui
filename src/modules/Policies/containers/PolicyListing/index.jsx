import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PolicyItem from '../../components/PolicyItem';

import * as actions from '../../actions';

class PolicyListing extends Component {
  static propTypes = {
    fetchPolicies: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const fqon = this.props.fqon || this.props.params.fqon;
    const environmentId = this.props.environmentId || this.props.params.environmentId;
    this.props.fetchPolicies(fqon, environmentId);
  }

  componentWillUnmount() {
    const { onUnloadListing, clearSelected } = this.props;
    onUnloadListing();
    clearSelected();
  }

  render() {
    return <PolicyItem {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    policies: state.policies.fetchAll.policies,
    pending: state.policies.fetchAll.pending,
    selectedPolicies: state.policies.selectedPolicies,
  };
}

export default connect(mapStateToProps, actions)(PolicyListing);
