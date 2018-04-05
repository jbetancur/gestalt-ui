import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import withApp from 'App/withApp';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { ListItem, MenuButton } from 'react-md';
import Div from 'components/Div';
import { MetamodelIcon, ServiceIcon, ProviderIcon, UserIcon, GroupIcon, WorkspaceIcon, OrganizationIcon } from 'components/Icons';

const listItemStyle = { textAlign: 'left' };

class HierarchyActions extends PureComponent {
  static propTypes = {
    organizationSet: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    appState: PropTypes.object.isRequired,
  };

  render() {
    const { organizationSet, pending, t, appState } = this.props;

    const menuItems = [
      <ListItem
        id="orgs-settings-menu--create"
        key="orgs-settings-menu--create"
        primaryText={<span>{t('organizations.actions.createSubOrg')}</span>}
        component={Link}
        leftIcon={<OrganizationIcon />}
        to={{ pathname: `/${organizationSet.properties.fqon}/createOrganization`, state: { modal: true } }}
        style={listItemStyle}
      />,
      <ListItem
        id="orgs-settings-menu--workspace-create"
        key="orgs-settings-menu--workspace-create"
        primaryText={<span>{t('workspaces.actions.create')}</span>}
        component={Link}
        leftIcon={<WorkspaceIcon />}
        to={{ pathname: `/${organizationSet.properties.fqon}/createWorkspace`, state: { modal: true } }}
        style={listItemStyle}
      />,
      <ListItem
        id="orgs-settings-menu--provider-create"
        key="orgs-settings-menu--provider-create"
        primaryText={<span>{t('providers.actions.create')}</span>}
        component={Link}
        leftIcon={<ProviderIcon />}
        to={`/${organizationSet.properties.fqon}/providers/create`}
        style={listItemStyle}
      />,
      organizationSet.properties.fqon === 'root' ?
        <ListItem
          id="orgs-settings-menu--users-create"
          key="orgs-settings-menu--users-create"
          primaryText={<span>{t('users.actions.create')}</span>}
          component={Link}
          leftIcon={<UserIcon />}
          to={`/${organizationSet.properties.fqon}/users/create`}
          style={listItemStyle}
        /> : <div key="orgs-settings-menu--users-create" />,
      organizationSet.properties.fqon === 'root' ?
        <ListItem
          id="orgs-settings-menu--groups-create"
          key="orgs-settings-menu--groups-create"
          primaryText={<span>{t('groups.actions.create')}</span>}
          component={Link}
          leftIcon={<GroupIcon />}
          to={`/${organizationSet.properties.fqon}/groups/create`}
          style={listItemStyle}
        /> : <div key="orgs-settings-menu--groups-create" />,
      <ListItem
        id="orgs-settings-menu--resourceTypes-create"
        key="orgs-settings-menu--resourceTypes-create"
        primaryText="Resource Type"
        component={Link}
        leftIcon={<MetamodelIcon />}
        to={`/${organizationSet.properties.fqon}/resourcetypes/create`}
        style={listItemStyle}
      />,
      appState.enableExperimental ?
        <ListItem
          id="orgs-settings-menu--serviceSpecs-create"
          key="orgs-settings-menu--serviceSpecs-create"
          primaryText="Service Specification"
          component={Link}
          leftIcon={<ServiceIcon />}
          to={`/${organizationSet.properties.fqon}/servicespecs/create`}
          style={listItemStyle}
        /> : <div key="orgs-settings-menu--groups-create" />
    ];

    return (
      <Div display="inline" disabled={pending}>
        <MenuButton
          id="orgs-settings-menu"
          anchor={{
            x: MenuButton.HorizontalAnchors.CENTER,
            y: MenuButton.VerticalAnchors.CENTER,
          }}
          iconChildren="add"
          flat
          sameWidth={false}
          menuItems={menuItems}
          listHeightRestricted={false}
        >
          Create
        </MenuButton>
      </Div>
    );
  }
}

export default compose(
  translate(),
  withApp,
)(HierarchyActions);
