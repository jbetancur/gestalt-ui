import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { getParentFQON } from 'util/helpers/strings';
import { DeleteIcon } from 'components/Icons';
import { Button } from 'components/Buttons';

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
  };

  delete(e, organization) {
    e.stopPropagation();
    const { history, deleteOrg } = this.props;
    const parentFQON = getParentFQON(organization);
    const onSuccess = () => history.replace(`/${parentFQON}/hierarchy`);

    this.props.confirmDelete(() => {
      deleteOrg(organization.properties.fqon, onSuccess);
    }, name, 'Organization');
  }

  render() {
    const { organizationSet, match, pending, self, t } = this.props;
    const name = organizationSet.description || organizationSet.name;
    const deleteDisabled = pending || (match.params.fqon === self.properties.gestalt_home || match.params.fqon === 'root');

    return (
      <div>
        <MenuButton
          id="orgs-settings-menu"
          position="below"
          disabled={pending}
          buttonChildren="add"
          flat
          label="Create"
        >
          <ListItem
            id="orgs-settings-menu--create"
            primaryText={<span>{t('organizations.actions.createSubOrg')}</span>}
            component={Link}
            to={`/${organizationSet.properties.fqon}/hierarchy/createOrganization`}
          />
          <ListItem
            id="orgs-settings-menu--workspace-create"
            primaryText={<span>{t('workspaces.actions.create')}</span>}
            component={Link}
            to={`/${organizationSet.properties.fqon}/hierarchy/createWorkspace`}
          />

        </MenuButton>
        <Button
          disabled={pending}
          flat
          label="Edit"
          component={Link}
          to={`/${organizationSet.properties.fqon}/hierarchy/editOrganization`}
        >
        edit
        </Button>
        <Button
          disabled={pending}
          flat
          label="Entitlements"
          onClick={() => this.props.showEntitlementsModal(name, match.params, 'Organization')}
        >
          security
        </Button>
        <Button
          disabled={deleteDisabled}
          flat
          label="Delete"
          onClick={e => this.delete(e, organizationSet)}
        >
          <DeleteIcon />
        </Button>
      </div>
    );
  }
}

export default HierarchyAction;
