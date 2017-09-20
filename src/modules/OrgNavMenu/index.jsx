import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import Divider from 'react-md/lib/Dividers';
import TextField from 'react-md/lib/TextFields';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { sortBy } from 'lodash';
import DotActivity from 'components/DotActivity';
import { withMetaResource } from 'modules/MetaResource';
import actions from './actions';

const EnhancedMenuButton = styled(MenuButton)`
  min-width: 21em;
  z-index: 99;
  margin-top: 0 !important;
  height: 100%;
  border-radius: 0;
  border-right: 1px solid ${props => props.theme.colors['$md-grey-800']}
`;

const ListWrapper = styled.div`
  min-width: 19.4em;
  padding: 1em;
  color: black;
`;

const DividerStyled = styled(Divider)`
  margin: 0 !important;
`;

class OrgNavMenu extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchAllOrgs: PropTypes.func.isRequired,
    filterOrgs: PropTypes.func.isRequired,
    allOrganizations: PropTypes.array.isRequired,
    allOrganizationsPending: PropTypes.bool.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    onUnloadAllOrgs: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.fetchOrgList = this.fetchOrgList.bind(this);
    this.filterOrgs = this.filterOrgs.bind(this);
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
      <div key={item.id}>
        <DividerStyled />
        <ListItem
          value={item.properties.fqon}
          component={Link}
          primaryText={item.description || item.name}
          secondaryText={item.name}
          to={`/${item.properties.fqon}/hierarchy`}
        />
      </div>
    );
  }

  renderSearch() {
    const { allOrganizationsPending, t } = this.props;

    return (
      <div>
        <ListWrapper>
          {!allOrganizationsPending &&
            <div>
              <span className="gf-headline-2">SWITCH ORGANIZATION</span>
              <TextField
                id="search-orgs"
                label={t('general.verbs.search')}
                fullWidth={true}
                onChange={this.filterOrgs}
              />
            </div>}
        </ListWrapper>
        {allOrganizationsPending && <DotActivity primary size={1.2} id="orgs-nav-menu" centered />}
      </div>
    );
  }

  render() {
    const { match, currentOrgContext, allOrganizationsPending } = this.props;
    const showMenu = currentOrgContext.properties.fqon === match.params.fqon;

    return (
      <EnhancedMenuButton
        id="orgs-nav"
        label={this.props.currentOrgContext.description || currentOrgContext.name}
        position={MenuButton.Positions.BELOW}
        iconChildren="expand_more"
        flat
        iconBefore={false}
        onClick={this.fetchOrgList}
        disabled={!showMenu}
      >
        {/* https://github.com/mlaursen/react-md/issues/259 */}
        {[<div key="orgs-nav-menu">
          {this.renderSearch()}
          {!allOrganizationsPending && this.props.allOrganizations.map(this.renderOrgMenuItems, this)}
        </div>]}
      </EnhancedMenuButton>
    );
  }
}

const mapStateToProps = (state) => {
  const { orgnavmenu, metaResource } = state;
  const orgMenuItems = metaResource.allOrganizations.organizations.filter(val => val.name.includes(orgnavmenu.filter.filterText) || (val.description && val.description.includes(orgnavmenu.filter.filterText)));

  return {
    allOrganizations: sortBy(orgMenuItems, 'name'),
    currentOrgContext: metaResource.currentOrgContext.organization,
  };
};

export default withRouter(withMetaResource(connect(mapStateToProps, actions)(translate()(OrgNavMenu))));
