import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { sortBy } from 'lodash';
import styled from 'styled-components';
import Divider from 'react-md/lib/Dividers';
import TextField from 'react-md/lib/TextFields';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { DotActivity } from 'components/ProgressIndicators';
import { H3 } from 'components/Typography';
import { withMetaResource } from 'Modules/MetaResource';
import actions from './actions';

const EnhancedMenuButton = styled(MenuButton)`
  min-width: 21em;
  z-index: 99;
  margin-top: 0 !important;
  height: 100%;
  border-radius: 0;
  border-right: 1px solid ${props => props.theme.colors['$md-grey-800']};
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
    fetchAllOrgs: PropTypes.func.isRequired,
    filterOrgs: PropTypes.func.isRequired,
    allOrganizations: PropTypes.array.isRequired,
    allOrganizationsPending: PropTypes.bool.isRequired,
    organizationSet: PropTypes.object.isRequired,
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

    return [
      <ListWrapper key="orgs-nav--search">
        {!allOrganizationsPending &&
          <div>
            <H3>SWITCH ORGANIZATION</H3>
            <TextField
              id="search-orgs"
              label={t('general.verbs.search')}
              fullWidth={true}
              onChange={this.filterOrgs}
            />
          </div>}
      </ListWrapper>,
      <DotActivity
        id="orgs-nav--loader"
        key="orgs-nav--loader"
        visible={allOrganizationsPending}
        size={1.2}
        primary
        centered
      />
    ];
  }

  render() {
    const { organizationSet, allOrganizationsPending } = this.props;
    const name = this.props.organizationSet.description || organizationSet.name;

    return (
      <EnhancedMenuButton
        id="orgs-nav"
        label={name}
        position={MenuButton.Positions.BELOW}
        iconChildren="expand_more"
        flat
        iconBefore={false}
        onClick={this.fetchOrgList}
      >
        {/* https://github.com/mlaursen/react-md/issues/259 */}
        {[
          <div key="orgs-nav-menu">
            {this.renderSearch()}
            {!allOrganizationsPending && this.props.allOrganizations.map(this.renderOrgMenuItems, this)}
          </div>
        ]}
      </EnhancedMenuButton>
    );
  }
}

const mapStateToProps = (state) => {
  const { orgnavmenu, metaResource } = state;
  const orgMenuItems = metaResource.allOrganizations.organizations.filter(val => val.name.includes(orgnavmenu.filter.filterText) || (val.description && val.description.includes(orgnavmenu.filter.filterText)));

  return {
    allOrganizations: sortBy(orgMenuItems, 'name'),
  };
};

export default compose(
  withMetaResource,
  withRouter,
  translate(),
  connect(mapStateToProps, actions)
)(OrgNavMenu);
