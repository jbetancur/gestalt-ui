import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ProviderItem from '../../components/ProviderItem';

import * as actions from '../../actions';

class Providers extends Component {
  static propTypes = {
    fetchProviders: PropTypes.func.isRequired,
    params: PropTypes.object,
    fqon: PropTypes.string.isRequired,
    workspaceId: PropTypes.string,
    environmentId: PropTypes.string
  };

  static defaultProps = {
    params: {},
    workspaceId: null,
    environmentId: null
  };

  componentDidMount() {
    const { fqon, params, workspaceId, environmentId, fetchProviders } = this.props;
    const resolvedFqon = fqon || params.fqon;
    const entityId = workspaceId || environmentId || null;
    const entityKey = workspaceId ? 'workspaces' : 'environments';
    fetchProviders(resolvedFqon, entityId, entityKey);
  }

  render() {
    return <ProviderItem {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    providers: state.providers.fetchAll.items,
    pending: state.providers.fetchAll.pending,
    selectedProviders: state.providers.selectedProviders
  };
}

export default connect(mapStateToProps, actions)(Providers);
