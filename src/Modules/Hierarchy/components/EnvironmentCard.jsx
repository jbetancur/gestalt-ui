import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import { withTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import { EntitlementIcon, EnvironmentIcon, DeleteIcon } from 'components/Icons';
import { withUserProfile } from 'Modules/UserProfile';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import NameModal from 'Modules/ModalRoot/Modals/NameModal';
import Card from './GFCard';
import withContext from '../hocs/withContext';

class EnvironmentCard extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    userProfileActions: PropTypes.object.isRequired,
  };

  static contextType = ModalContext;

  navEnvironmentDetails = () => {
    const { model, match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}`);
  }

  edit = () => {
    const { model, match, history } = this.props;

    history.push({ pathname: `/${match.params.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}/edit`, state: { modal: true, card: true } });
  }

  delete = () => {
    const { model, match, hierarchyContextActions } = this.props;
    const { showModal } = this.context;
    const name = model.description || model.name;
    const onSuccess = () => {
      hierarchyContextActions.fetchEnvironments({ fqon: match.params.fqon, entityId: model.properties.workspace.id });
    };

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Environment`,
      values: { name, type: 'Environment' },
      requireConfirm: true,
      important: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteEnvironment({ fqon: match.params.fqon, resource: model, onSuccess, params: { force } }),
    });
  }

  showEntitlements = () => {
    const { model } = this.props;
    const { showModal } = this.context;
    const name = model.description || model.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Environment`,
      fqon: model.org.properties.fqon,
      entityId: model.id,
      entityKey: 'environments',
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
    const { model, t, theme } = this.props;
    const title = model.description || model.name;

    return (
      <Card
        id={`${model.name}--environment`}
        key={model.id}
        title={title}
        subtitle={model.owner.name}
        created={model.created.timestamp}
        favorited={model.$$favorite}
        onFavoriteToggled={this.handleFavoriteToggle}
        onClick={this.navEnvironmentDetails}
        raise
        cardColor={theme.colors.environment}
        cardIcon={<EnvironmentIcon size={14} />}
        environmentType={model.properties.environment_type}
        menuActions={[
          {
            id: 'environment-card--edit',
            key: 'environment-card--edit',
            title: t('general.verbs.edit'),
            icon: <EditIcon color="action" fontSize="small" />,
            onClick: this.edit,
          },
          {
            id: 'environment-card--entitlements',
            key: 'environment-card--entitlements',
            title: 'Entitlements',
            icon: <EntitlementIcon size={20} />,
            onClick: this.showEntitlements,
          },
          {
            id: 'environment-card--delete',
            key: 'environment-card--edit',
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
)(EnvironmentCard);
