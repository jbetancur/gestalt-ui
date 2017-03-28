import React, { Component, PropTypes } from 'react';
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
  top: .1em;
  height: 100%;
  margin-left: .5em;

  .md-icon-text {
    font-size: 12px;
  }

  .md-icon-text:last-child {
    padding: 1px;
  }
`;

class OrgNavMenu extends Component {
  static propTypes = {
    fetchAllOrgs: PropTypes.func.isRequired,
    filterOrgs: PropTypes.func.isRequired,
    organizations: PropTypes.array.isRequired,
    orgFetching: PropTypes.bool.isRequired,
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
    const { orgFetching, t } = this.props;

    return (
      <div>
        <div style={{ padding: '1em', color: 'black' }}>
          {!orgFetching ?
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
          {orgFetching ? <CircularProgress id="orgs-nav-menu" /> : null}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <EnhancedMenuButton
          id="orgs-menu"
          label={this.props.t('organizations.orgNav')}
          flat
          fullWidth
          position="below"
          buttonChildren="expand_more"
          onClick={e => this.fetchOrgList(e)}
        >
          {/* https://github.com/mlaursen/react-md/issues/259 */}
          {[<div key="orgs-nav-menu">
            {this.renderSearch()}
            {this.props.organizations.map(this.renderOrgMenuItems, this)}
          </div>]}
        </EnhancedMenuButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { orgnavmenu, metaResource } = state;
  const orgMenuItems = metaResource.allOrganizations.organizations.filter(val => val.name.includes(orgnavmenu.filter.filterText) || (val.description && val.description.includes(orgnavmenu.filter.filterText)));

  return {
    organizations: sortBy(orgMenuItems, 'name'),
    orgFetching: metaResource.allOrganizations.pending,
  };
};

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(translate()(OrgNavMenu));
