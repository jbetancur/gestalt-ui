import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import { translate } from 'react-i18next';
import { FontIcon } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { EntitlementIcon, EnvironmentIcon, DeleteIcon } from 'components/Icons';
import Card from './GFCard';
import withHierarchy from '../hocs/withHierarchy';
import withContext from '../hocs/withContext';

class EnvironmentCard extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  navEnvironmentDetails = () => {
    const { model, match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}`);
  }

  edit = () => {
    const { model, match, history } = this.props;

    history.push({ pathname: `/${match.params.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}/edit`, state: { modal: true, card: true } });
  }

  delete = () => {
    const { model, match, hierarchyContextActions, hierarchyActions } = this.props;
    const name = model.description || model.name;
    const onSuccess = () => {
      hierarchyContextActions.fetchEnvironments({ fqon: match.params.fqon, entityId: model.properties.workspace.id });
    };

    hierarchyActions.confirmDelete(({ force }) => {
      hierarchyContextActions.deleteEnvironment({ fqon: match.params.fqon, resource: model, onSuccess, params: { force } });
    }, name, 'Environment');
  }

  showEntitlements = () => {
    const { entitlementActions, model, match } = this.props;
    const name = model.description || model.name;

    entitlementActions.showEntitlementsModal(name, match.params.fqon, model.id, 'environments', 'Environment');
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
            icon: <FontIcon>edit</FontIcon>,
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
  withTheme,
  translate(),
)(EnvironmentCard);
