import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { withEntitlements } from 'Modules/Entitlements';
import { EntitlementIcon, WorkspaceIcon } from 'components/Icons';
import { FontIcon } from 'react-md';
import Card from '../components/GFCard';
import CardTitle from '../components/GFCardTitle';
import withHierarchy from '../hocs/withHierarchy';
import withContext from '../hocs/withContext';

class WorkspaceCard extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    contextActions: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
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
    const { model, match, contextActions, hierarchyActions } = this.props;
    const name = model.description || model.name;

    hierarchyActions.confirmDelete(({ force }) => {
      contextActions.deleteWorkspace({ fqon: match.params.fqon, resource: model, params: { force } });
    }, name, 'Workspace');
  }

  showEntitlements = () => {
    const { entitlementActions, model, match } = this.props;
    const name = model.description || model.name;

    entitlementActions.showEntitlementsModal(name, match.params.fqon, model.id, 'workspaces', 'Workspace');
  }

  render() {
    const { t, model, theme } = this.props;
    const title = model.description || model.name;

    return (
      <Card
        id={`${model.name}--workspace`}
        key={model.id}
        onClick={this.navWorkspaceDetails}
        raise
        cardIcon={<WorkspaceIcon size={14} />}
        cardColor={theme.workspaceCard}
        created={model.created.timestamp}
        menuActions={[
          {
            id: 'workspace-card--edit',
            title: t('general.verbs.edit'),
            icon: <FontIcon>edit</FontIcon>,
            onClick: this.edit,
          },
          {
            id: 'workspace-card--entitlements',
            title: 'Entitlements',
            icon: <EntitlementIcon size={20} />,
            onClick: this.showEntitlements,
          },
          {
            id: 'workspace-card--delete',
            title: t('general.verbs.delete'),
            icon: <FontIcon>delete_forever</FontIcon>,
            onClick: this.delete,
          }
        ]}
      >
        <CardTitle
          title={title}
          subTitle={model.owner.name}
        />
      </Card>
    );
  }
}

export default compose(
  withContext(),
  withHierarchy,
  withEntitlements,
  withTheme,
  translate(),
)(WorkspaceCard);
