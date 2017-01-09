import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PolicyItem from '../../components/PolicyItem';

import * as actions from '../../actions';

class Policies extends Component {
  static propTypes = {
    fetchPolicies: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.router.params.fqon;
    const environmentId = this.props.environmentId || this.props.router.params.environmentId;
    this.props.fetchPolicies(fqon, environmentId);
  }

  render() {
    return (
      <div>
        <PolicyItem {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    policies: state.policies.fetchAll.items,
    pending: state.policies.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(Policies);
