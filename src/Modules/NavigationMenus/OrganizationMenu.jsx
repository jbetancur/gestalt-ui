import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { sortBy } from 'lodash';
import { withContext } from 'Modules/Hierarchy';
import Menu from './components/Menu';

class OrgMenu extends PureComponent {
  static propTypes = {
    // allOrganizations: PropTypes.array.isRequired,
    allOrganizationsPending: PropTypes.bool.isRequired,
    context: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
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
    const { contextActions } = this.props;

    contextActions.unloadAllOrgs();
  }

  fetchOrgList = (e) => {
    const { contextActions } = this.props;
    e.preventDefault();

    contextActions.unloadAllOrgs();
    contextActions.fetchAllOrgs();
  }

  handleFilter = (filterText) => {
    this.setState({ filterText });
  }

  render() {
    const { context: { organization }, allOrganizationsPending } = this.props;
    const name = organization.description || organization.name;
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
  withContext(),
  withRouter,
)(OrgMenu);
