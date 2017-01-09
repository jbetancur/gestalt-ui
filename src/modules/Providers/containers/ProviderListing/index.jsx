import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ProviderItem from '../../components/ProviderItem';
import FooterActions from '../../../../components/FooterActions';

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
    const fqon = this.props.fqon || this.props.params.fqon;
    const entityId = this.props.workspaceId || this.props.environmentId || null;
    const entityKey = this.props.workspaceId ? 'workspaces' : 'environments';
    this.props.fetchProviders(fqon, entityId, entityKey);
  }

  render() {
    return (
      <div>
        <ProviderItem {...this.props} />
        <FooterActions />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    providers: state.providers.fetchAll.items,
    pending: state.providers.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(Providers);
