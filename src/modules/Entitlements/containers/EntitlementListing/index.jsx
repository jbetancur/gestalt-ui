import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import EntitlementItem from '../../components/EntitlementItem';

import * as actions from '../../actions';

class Entitlements extends Component {
  static propTypes = {
    fetchEntitlements: PropTypes.func.isRequired,
    params: PropTypes.object,
    fqon: PropTypes.string,
    workspaceId: PropTypes.string,
    environmentId: PropTypes.string
  };

  static defaultProps = {
    params: {},
    fqon: null,
    workspaceId: null,
    environmentId: null
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.params.fqon;
    const entityId = this.props.workspaceId || this.props.environmentId || null;
    const entityKey = this.props.workspaceId ? 'workspaces' : 'environments';
    this.props.fetchEntitlements(fqon, entityId, entityKey);
  }

  render() {
    return (
      <div>
        <EntitlementItem {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    entitlements: state.entitlements.fetchAll.items,
    pending: state.entitlements.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(Entitlements);
