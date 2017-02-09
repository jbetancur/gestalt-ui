import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ProviderItem from '../../components/ProviderItem';

import * as actions from '../../actions';

class ProviderListing extends Component {
  static propTypes = {
    fetchProviders: PropTypes.func.isRequired,
    params: PropTypes.object,
    fqon: PropTypes.string,
    workspaceId: PropTypes.string,
    environmentId: PropTypes.string,
    onUnloadListing: PropTypes.func.isRequired,
  };

  static defaultProps = {
    params: {},
    fqon: null,
    workspaceId: null,
    environmentId: null,
  };

  componentDidMount() {
    const { fqon, params, workspaceId, environmentId, fetchProviders } = this.props;
    const resolvedFqon = fqon || params.fqon;
    const entityId = workspaceId || environmentId || null;
    const entityKey = workspaceId ? 'workspaces' : 'environments';
    fetchProviders(resolvedFqon, entityId, entityKey);
  }

  componentWillUnmount() {
    this.props.onUnloadListing();
  }

  render() {
    return <ProviderItem {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    providers: state.providers.fetchAll.providers,
    pending: state.providers.fetchAll.pending,
    selectedProviders: state.providers.selectedProviders
  };
}

export default connect(mapStateToProps, actions)(ProviderListing);
