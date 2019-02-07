import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { withEntitlements } from 'Modules/Entitlements';
import { EntitlementIcon, WorkspaceIcon, DeleteIcon } from 'components/Icons';
import { FontIcon } from 'react-md';
import { withUserProfile } from 'Modules/UserProfile';
import Card from './GFCard';
import withHierarchy from '../hocs/withHierarchy';
import withContext from '../hocs/withContext';

class WorkspaceCard extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    userProfileActions: PropTypes.object.isRequired,
  };

  navWorkspaceDetails = () => {
    const { model, match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${model.id}/environments`);
  }

  edit = () => {
    const { model, match, history } = this.props;

    history.push({ pathname: `/${match.params.fqon}/hierarchy/${model.id}/edit`, state: { modal: true, card: true } });
  }

  delete = () => {
    const { model, match, hierarchyContextActions, hierarchyActions } = this.props;
    const name = model.description || model.name;

    hierarchyActions.confirmDelete(({ force }) => {
      hierarchyContextActions.deleteWorkspace({ fqon: match.params.fqon, resource: model, params: { force } });
    }, name, 'Workspace');
  }

  showEntitlements = () => {
    const { entitlementActions, model, match } = this.props;
    const name = model.description || model.name;

    entitlementActions.showEntitlementsModal(name, match.params.fqon, model.id, 'workspaces', 'Workspace');
  }

  handleFavoriteToggle = () => {
    const { model, userProfileActions } = this.props;
    const nickname = model.description || model.name;

    if (model.$$favorite) {
      userProfileActions.deleteFavorite({ id: model.id });
    } else {
      userProfileActions.createFavorite({ payload: { resource_id: model.id, nickname } });
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

export default compose(
  withContext(),
  withHierarchy,
  withEntitlements,
  withUserProfile,
  withTheme,
  translate(),
)(WorkspaceCard);
