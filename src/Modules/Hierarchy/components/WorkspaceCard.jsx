import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'styled-components';
import { EntitlementIcon, WorkspaceIcon, DeleteIcon } from 'components/Icons';
import { FontIcon } from 'react-md';
import { withUserProfile } from 'Modules/UserProfile';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import NameModal from 'Modules/ModalRoot/Modals/NameModal';
import Card from './GFCard';
import withContext from '../hocs/withContext';

class WorkspaceCard extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    userProfileActions: PropTypes.object.isRequired,
  };

  static contextType = ModalConsumer;

  navWorkspaceDetails = () => {
    const { model, match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${model.id}/environments`);
  }

  edit = () => {
    const { model, match, history } = this.props;

    history.push({ pathname: `/${match.params.fqon}/hierarchy/${model.id}/edit`, state: { modal: true, card: true } });
  }

  delete = () => {
    const { model, match, hierarchyContextActions } = this.props;
    const { showModal } = this.context;
    const name = model.description || model.name;

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Workspace`,
      values: { name, type: 'Environment' },
      requireConfirm: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteWorkspace({ fqon: match.params.fqon, resource: model, params: { force } }),
    });
  }

  showEntitlements = () => {
    const { model } = this.props;
    const { showModal } = this.context;
    const name = model.description || model.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Workspace`,
      fqon: model.org.properties.fqon,
      entityId: model.id,
      entityKey: 'workspaces',
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
        id={`${model.name}--workspace`}
        key={model.id}
        title={title}
        subtitle={model.owner.name}
        created={model.created.timestamp}
        favorited={model.$$favorite}
        onFavoriteToggled={this.handleFavoriteToggle}
        onClick={this.navWorkspaceDetails}
        raise
        cardIcon={<WorkspaceIcon size={14} />}
        cardColor={theme.colors.workspace}
        menuActions={[
          {
            id: 'workspace-card--edit',
            key: 'workspace-card--edit',
            title: t('general.verbs.edit'),
            icon: <FontIcon>edit</FontIcon>,
            onClick: this.edit,
          },
          {
            id: 'workspace-card--entitlements',
            key: 'workspace-card--entitlements',
            title: 'Entitlements',
            icon: <EntitlementIcon size={20} />,
            onClick: this.showEntitlements,
          },
          {
            id: 'workspace-card--delete',
            key: 'workspace-card--delete',
            title: t('general.verbs.delete'),
            icon: <DeleteIcon />,
            onClick: this.delete,
          }
        ]}
      />
    );
  }
}

// WorkspaceCard.contextType = ModalConsumer;

export default compose(
  withContext(),
  withUserProfile,
  withTheme,
  withTranslation(),
)(WorkspaceCard);
