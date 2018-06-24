import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { sortBy } from 'lodash';
import { withMetaResource } from 'Modules/MetaResource';
import Menu from './components/Menu';

class OrgMenu extends PureComponent {
  static propTypes = {
    fetchAllOrgs: PropTypes.func.isRequired,
    // allOrganizations: PropTypes.array.isRequired,
    allOrganizationsPending: PropTypes.bool.isRequired,
    organizationSet: PropTypes.object.isRequired,
    onUnloadAllOrgs: PropTypes.func.isRequired,
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
    this.props.onUnloadAllOrgs();
  }

  fetchOrgList = (e) => {
    e.preventDefault();
    this.props.onUnloadAllOrgs();
    this.props.fetchAllOrgs();
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
  withMetaResource,
  withRouter,
)(OrgMenu);
