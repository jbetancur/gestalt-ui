import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';
import withHierarchy from '../withHierarchy';

const listItemStyle = { textAlign: 'left' };

class HierarchyActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
  };

  render() {
    const { organizationSet, match, pending, hierarchyActions, t } = this.props;
    const name = organizationSet.description || organizationSet.name;

    return (
      <Div display="inline" disabled={pending}>
        <MenuButton
          id="orgs-settings-menu"
          position="below"
          iconChildren="add"
          flat
          sameWidth={false}
          label="Create"
        >
          <ListItem
            id="orgs-settings-menu--create"
            primaryText={<span>{t('organizations.actions.createSubOrg')}</span>}
            component={Link}
            leftIcon={<FontIcon>domain</FontIcon>}
            to={`/${organizationSet.properties.fqon}/createOrganization`}
            style={listItemStyle}
          />
          <ListItem
            id="orgs-settings-menu--workspace-create"
            primaryText={<span>{t('workspaces.actions.create')}</span>}
            component={Link}
            leftIcon={<FontIcon>work</FontIcon>}
            to={`/${organizationSet.properties.fqon}/createWorkspace`}
            style={listItemStyle}
          />
          <ListItem
            id="orgs-settings-menu--provider-create"
            primaryText={<span>{t('providers.actions.create')}</span>}
            component={Link}
            leftIcon={<FontIcon>settings_applications</FontIcon>}
            to={`/${organizationSet.properties.fqon}/providers/create`}
            style={listItemStyle}
          />
          {organizationSet.properties.fqon === 'root' ?
            <ListItem
              id="orgs-settings-menu--users-create"
              primaryText={<span>{t('users.actions.create')}</span>}
              component={Link}
              leftIcon={<FontIcon>person</FontIcon>}
              to={`/${organizationSet.properties.fqon}/users/create`}
              style={listItemStyle}
            /> : <div />}
          {organizationSet.properties.fqon === 'root' ?
            <ListItem
              id="orgs-settings-menu--groups-create"
              primaryText={<span>{t('groups.actions.create')}</span>}
              component={Link}
              leftIcon={<FontIcon>group</FontIcon>}
              to={`/${organizationSet.properties.fqon}/groups/create`}
              style={listItemStyle}
            /> : <div />}
        </MenuButton>
        <Button
          flat
          iconChildren="security"
          onClick={() => hierarchyActions.showEntitlementsModal(name, match.params, 'Organization')}
        >
        Entitlements
        </Button>
      </Div>
    );
  }
}

export default compose(
  translate(),
  withMetaResource,
  withHierarchy,
)(HierarchyActions);
