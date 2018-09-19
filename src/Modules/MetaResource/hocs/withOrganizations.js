import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

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
    organizations: state.hierarchy.organizations.organizations,
    organizationsPending: state.hierarchy.organizations.pending,
    allOrganizations: state.hierarchy.allOrganizations.organizations,
    allOrganizationsPending: state.hierarchy.allOrganizations.pending,
    allOrganizationsDropDown: state.hierarchy.allOrganizationsDropDown.organizations,
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
