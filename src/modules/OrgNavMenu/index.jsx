import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import TextField from 'react-md/lib/TextFields';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import * as actions from './actions';

const EnhancedMenuButton = styled(MenuButton)`
  // top: .1em;
  // height: 100%;
  // margin-left: .5em;

  .md-icon-text {
    font-size: 12px;
  }

  .md-icon-text:last-child {
    padding: 1px;
  }
`;

class OrgNavMenu extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fetchAllOrgs: PropTypes.func.isRequired,
    filterOrgs: PropTypes.func.isRequired,
    organizations: PropTypes.array.isRequired,
    organizationsPending: PropTypes.bool.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    onUnloadAllOrgs: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.onUnloadAllOrgs();
  }

  filterOrgs(value) {
    this.props.filterOrgs(value);
  }

  fetchOrgList(e) {
    e.preventDefault();
    this.props.onUnloadAllOrgs();
    this.props.filterOrgs('');
    this.props.fetchAllOrgs();
  }

  renderOrgMenuItems(item) {
    return (
      <ListItem
        key={item.id}
        value={item.properties.fqon}
        component={Link}
        primaryText={item.description || item.name}
        secondaryText={item.name}
        to={`/${item.properties.fqon}/organizations`}
      />
    );
  }

  renderSearch() {
    const { organizationsPending, t } = this.props;

    return (
      <div>
        <div style={{ padding: '1em', color: 'black' }}>
          {!organizationsPending ?
            <div>
              <TextField
                id="search-orgs"
                label={t('general.verbs.search')}
                fullWidth={true}
                onChange={value => this.filterOrgs(value)}
              />
            </div> : null}
        </div>
        <div style={{ textAlign: 'center' }}>
          {organizationsPending ? <CircularProgress id="orgs-nav-menu" /> : null}
        </div>
      </div>
    );
  }

  render() {
    const { params, currentOrgContext, organizationsPending } = this.props;

    return (
      <EnhancedMenuButton
        id="orgs-menu"
        label={this.props.currentOrgContext.description || currentOrgContext.name || ''}
        position={MenuButton.Positions.TOP_RIGHT}
        buttonChildren={currentOrgContext.properties.fqon === params.fqon ? 'expand_more' : null}
        flat
        iconBefore={false}
        onClick={e => this.fetchOrgList(e)}
      >
        {/* https://github.com/mlaursen/react-md/issues/259 */}
        {[<div key="orgs-nav-menu">
          {this.renderSearch()}
          {!organizationsPending ? this.props.organizations.map(this.renderOrgMenuItems, this) : null}
        </div>]}
      </EnhancedMenuButton>
    );
  }
}

const mapStateToProps = (state) => {
  const { orgnavmenu, metaResource } = state;
  const orgMenuItems = metaResource.allOrganizations.organizations.filter(val => val.name.includes(orgnavmenu.filter.filterText) || (val.description && val.description.includes(orgnavmenu.filter.filterText)));

  return {
    organizations: sortBy(orgMenuItems, 'name'),
    organizationsPending: metaResource.allOrganizations.pending,
    currentOrgContext: metaResource.currentOrgContext.organization,
  };
};

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(translate()(OrgNavMenu));
