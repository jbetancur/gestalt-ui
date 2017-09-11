import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import { getParentFQON } from 'util/helpers/strings';
import { DeleteIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';

const listItemStyle = { textAlign: 'left' };

class HierarchyAction extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationSet: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    deleteOrg: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    self: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
  };

  delete(e, organization) {
    e.stopPropagation();
    const { history, deleteOrg } = this.props;
    const name = organization.description || organization.name;
    const parentFQON = getParentFQON(organization);
    const onSuccess = () => history.replace(`/${parentFQON}/hierarchy`);

    this.props.confirmDelete(() => {
      deleteOrg(organization.properties.fqon, onSuccess);
    }, name, 'Organization');
  }

  render() {
    const { organizationSet, match, pending, self, t, handleNavigation } = this.props;
    const name = organizationSet.description || organizationSet.name;
    const deleteDisabled = pending || (match.params.fqon === self.properties.gestalt_home || match.params.fqon === 'root');

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
            to={`/${organizationSet.properties.fqon}/hierarchy/createOrganization`}
            style={listItemStyle}
          />
          <ListItem
            id="orgs-settings-menu--workspace-create"
            primaryText={<span>{t('workspaces.actions.create')}</span>}
            component={Link}
            leftIcon={<FontIcon>work</FontIcon>}
            to={`/${organizationSet.properties.fqon}/hierarchy/createWorkspace`}
            style={listItemStyle}
          />
          <ListItem
            id="orgs-settings-menu--provider-create"
            primaryText={<span>{t('providers.actions.create')}</span>}
            component={Link}
            leftIcon={<FontIcon>settings_applications</FontIcon>}
            to={`/${organizationSet.properties.fqon}/hierarchy/providers/create`}
            onClick={() => handleNavigation('hierarchy', 'providers', 1)}
            style={listItemStyle}
          />
          {organizationSet.properties.fqon === 'root' ?
            <ListItem
              id="orgs-settings-menu--users-create"
              primaryText={<span>{t('users.actions.create')}</span>}
              component={Link}
              leftIcon={<FontIcon>person</FontIcon>}
              to={`/${organizationSet.properties.fqon}/hierarchy/users/create`}
              onClick={() => handleNavigation('hierarchy', 'users', 2)}
              style={listItemStyle}
            /> : <div />}
          {organizationSet.properties.fqon === 'root' ?
            <ListItem
              id="orgs-settings-menu--groups-create"
              primaryText={<span>{t('groups.actions.create')}</span>}
              component={Link}
              leftIcon={<FontIcon>group</FontIcon>}
              to={`/${organizationSet.properties.fqon}/hierarchy/groups/create`}
              onClick={() => handleNavigation('hierarchy', 'groups', 3)}
              style={listItemStyle}
            /> : <div />}
        </MenuButton>

        <Button
          flat
          iconChildren="edit"
          component={Link}
          to={`/${organizationSet.properties.fqon}/hierarchy/editOrganization`}
        >
          Edit
        </Button>
        <Button
          flat
          iconChildren="security"
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Organization')}
        >
        Entitlements
        </Button>
        <Button
          disabled={deleteDisabled}
          flat
          iconChildren={<DeleteIcon />}
          onClick={e => this.delete(e, organizationSet)}
        >
          Delete
        </Button>
      </Div>
    );
  }
}

export default HierarchyAction;
