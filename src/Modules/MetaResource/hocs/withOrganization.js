import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default () => (BaseComponent) => {
  class Organization extends Component {
    static displayName = 'Organization (HOC)';

    static propTypes = {
      organizationActions: PropTypes.object.isRequired,
    };

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    organization: state.hierarchy.organization.organization,
    organizationPending: state.hierarchy.organization.pending,
    organizationSet: state.hierarchy.organizationSet.organization,
    organizationSetPending: state.hierarchy.organizationSet.pending,
  });

  const mapDispatchToProps = dispatch => ({
    organizationActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'create', 'update', 'delete'], 'Org'),
      createRequestAction(['fetch'], 'OrgSet'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Organization);
};
