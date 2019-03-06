import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'styled-components';
import EditIcon from '@material-ui/icons/Edit';
import { EntitlementIcon, OrganizationIcon, DeleteIcon } from 'components/Icons';
import { withUserProfile } from 'Modules/UserProfile';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import NameModal from 'Modules/ModalRoot/Modals/NameModal';
import Card from './GFCard';
import withContext from '../hocs/withContext';

class OrganizationCard extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    userProfileActions: PropTypes.object.isRequired,
  };

  static contextType = ModalConsumer;

  navTo = () => {
    const { model, history } = this.props;

    history.push(`/${model.properties.fqon}/hierarchy`);
  }

  edit = () => {
    const { model, history } = this.props;

    history.push({
      pathname: `/${model.properties.fqon}/editOrganization`,
      state: {
        modal: true,
        card: true,
      },
    });
  }

  delete = () => {
    const { model, hierarchyContextActions } = this.props;
    const { showModal } = this.context;
    const name = model.description || model.name;

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Organization`,
      values: { name, type: 'Environment' },
      requireConfirm: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteOrg({ fqon: model.properties.fqon, resource: model, params: { force } }),
    });
  }

  showEntitlements = () => {
    const { model } = this.props;
    const { showModal } = this.context;
    const name = model.description || model.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Organization`,
      fqon: model.properties.fqon,
      entityId: null,
      entityKey: null,
    });
  }

  handleFavoriteToggle = () => {
    const { model, userProfileActions } = this.props;
    const defaultName = model.description || model.name;
    const { showModal } = this.context;

    if (model.$$favorite) {
      userProfileActions.deleteFavorite({ id: model.id });
    } else {
      showModal(NameModal, {
        title: `Favorite "${defaultName}"`,
        textLabel: 'Nickname',
        defaultName,
        proceedLabel: 'Favorite',
        onProceed: ({ name }) => userProfileActions.createFavorite({
          payload: {
            resource_id: model.id,
            nickname: name,
            resource_description: defaultName,
          }
        }),
      });
    }
  }

  render() {
    const { t, model, theme } = this.props;
    const title = model.description || model.name;

    return (
      <Card
        id={`${model.name}--organization`}
        key={model.id}
        title={title}
        subtitle={model.owner.name}
        created={model.created.timestamp}
        favorited={model.$$favorite}
        onFavoriteToggled={this.handleFavoriteToggle}
        onClick={this.navTo}
        raise
        cardIcon={<OrganizationIcon size={14} />}
        cardColor={theme.colors.organization}
        menuActions={[
          {
            id: 'organization-card--edit',
            key: 'organization-card--edit',
            title: t('general.verbs.edit'),
            icon: <EditIcon color="action" fontSize="small" />,
            onClick: this.edit,
          },
          {
            id: 'organization-card--entitlements',
            key: 'organization-card--entitlements',
            title: 'Entitlements',
            icon: <EntitlementIcon size={20} />,
            onClick: this.showEntitlements,
          },
          {
            id: 'organization-card--delete',
            key: 'organization-card--delete',
            title: t('general.verbs.delete'),
            icon: <DeleteIcon size={20} />,
            onClick: this.delete,
          }
        ]}
      />
    );
  }
}

export default compose(
  withContext(),
  withUserProfile,
  withTheme,
  withTranslation(),
)(OrganizationCard);
