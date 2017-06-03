import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import getParentFQON from 'util/helpers/fqon';
import { DeleteIcon } from 'components/Icons';

class HierarchyAction extends PureComponent {
  static propTypes = {
    params: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    pendingOrgset: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    deleteOrg: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    self: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
  };

  delete(e, organization) {
    e.stopPropagation();
    const { deleteOrg } = this.props;
    const parentFQON = getParentFQON(organization);
    const onSuccess = () => this.props.router.replace(`${parentFQON}/hierarchy`);

    this.props.confirmDelete(() => {
      deleteOrg(organization.properties.fqon, onSuccess);
    }, name, 'Organization');
  }

  render() {
    const { organization, params, pendingOrgset, self, t } = this.props;
    const name = organization.description || organization.name;

    return (
      <div>
        <MenuButton
          id="orgs-settings-menu"
          icon
          position="tl"
          disabled={pendingOrgset}
          buttonChildren="more_vert"
          onClick={e => e.stopPropagation()}
          tooltipLabel="Actions"
          tooltipPosition="bottom"
        >
          <ListItem
            id="orgs-settings-menu--create"
            primaryText={<span>{t('organizations.actions.createSubOrg')}</span>}
            leftIcon={<FontIcon>add</FontIcon>}
            component={Link}
            onClick={e => e.stopPropagation()}
            to={`/${organization.properties.fqon}/hierarchy/createOrganization`}
          />
          <ListItem
            id="orgs-settings-menu--workspace-create"
            primaryText={<span>{t('workspaces.actions.create')}</span>}
            leftIcon={<FontIcon>add</FontIcon>}
            component={Link}
            onClick={e => e.stopPropagation()}
            to={`/${organization.properties.fqon}/hierarchy/createWorkspace`}
          />
          <ListItem
            id="orgs-settings-menu--edit"
            primaryText={<span>{t('general.verbs.edit')} {name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            onClick={e => e.stopPropagation()}
            to={`/${organization.properties.fqon}/hierarchy/editOrganization`}
          />
          <ListItem
            id="orgs-settings-menu--entitlements"
            primaryText={<span>Entitlements {name}</span>}
            leftIcon={<FontIcon>security</FontIcon>}
            onClick={() => this.props.showEntitlementsModal(name, 'Organization')}
          />
          <Divider />
          <ListItem
            id="orgs-settings-menu--delete"
            primaryText={<span>{t('general.verbs.delete')} {name}</span>}
            leftIcon={<DeleteIcon />}
            disabled={params.fqon === self.properties.gestalt_home || params.fqon === 'root'}
            onClick={e => this.delete(e, organization)}
          />
        </MenuButton>
      </div>
    );
  }
}

export default HierarchyAction;
