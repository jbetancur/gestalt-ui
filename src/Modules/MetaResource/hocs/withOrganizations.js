import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from '../lib/actionFactory';

export default () => (BaseComponent) => {
  class Organizations extends Component {
    static displayName = 'Organizations (HOC)';

    static propTypes = {
      organizationsActions: PropTypes.object.isRequired,
    };

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    organizations: state.metaResource.organizations.organizations,
    organizationsPending: state.metaResource.organizations.pending,
    allOrganizations: state.metaResource.allOrganizations.organizations,
    allOrganizationsPending: state.metaResource.allOrganizations.pending,
    allOrganizationsDropDown: state.metaResource.allOrganizationsDropDown.organizations,
  });

  const mapDispatchToProps = dispatch => ({
    organizationsActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch'], 'Orgs'),
      createRequestAction(['fetch'], 'AllOrgs'),
      createRequestAction(['fetch'], 'AllOrgsDropDown'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Organizations);
};
