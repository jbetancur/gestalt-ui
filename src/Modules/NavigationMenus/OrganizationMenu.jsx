import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { sortBy } from 'lodash';
import { withOrganizations, withOrganization } from 'Modules/MetaResource';
import Menu from './components/Menu';

class OrgMenu extends PureComponent {
  static propTypes = {
    // allOrganizations: PropTypes.array.isRequired,
    allOrganizationsPending: PropTypes.bool.isRequired,
    organizationSet: PropTypes.object.isRequired,
    organizationsActions: PropTypes.object.isRequired,
  };

  state = {
    organizations: [],
    filterText: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.allOrganizations !== prevState.organizations) {
      return {
        organizations: sortBy(nextProps.allOrganizations, 'name'),
      };
    }

    return null;
  }

  componentWillUnmount() {
    const { organizationsActions } = this.props;

    organizationsActions.unloadAllOrgs();
  }

  fetchOrgList = (e) => {
    const { organizationsActions } = this.props;
    e.preventDefault();

    organizationsActions.unloadAllOrgs();
    organizationsActions.fetchAllOrgs();
  }

  handleFilter = (filterText) => {
    this.setState({ filterText });
  }

  render() {
    const { organizationSet, allOrganizationsPending } = this.props;
    const name = organizationSet.description || organizationSet.name;
    const allOrganizations =
      this.state.organizations.filter(val => val.name.includes(this.state.filterText)
        || (val.description && val.description.includes(this.state.filterText)));

    return (
      <Menu
        id="organization-nav-menu"
        title="SWITCH ORGANIZATION"
        name={name}
        menuItems={allOrganizations}
        pending={allOrganizationsPending}
        onFetchItems={this.fetchOrgList}
        onFilterChange={this.handleFilter}
        routePattern="/:properties.fqon/hierarchy"
      />
    );
  }
}

export default compose(
  withOrganizations(),
  withOrganization(),
  withRouter,
)(OrgMenu);
