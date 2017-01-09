import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import IntegrationsItem from '../../components/IntegrationItem';

import * as actions from '../../actions';

class IntegrationsListing extends Component {
  static propTypes = {
    fetchIntegrations: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.router.params.fqon;
    const environmentId = this.props.environmentId || this.props.router.params.environmentId;
    this.props.fetchIntegrations(fqon, environmentId);
  }

  render() {
    return (
      <div>
        <IntegrationsItem {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    integrations: state.integrations.fetchAll.items,
    pending: state.integrations.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(IntegrationsListing);
