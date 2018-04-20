import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import { translate } from 'react-i18next';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { EntitlementIcon } from 'components/Icons';
import { Subtitle } from 'components/Typography';
import { FormattedRelative } from 'react-intl';
import { FontIcon } from 'react-md';
import { Card, CardTitle } from '../components/GFCard';
import withHierarchy from '../withHierarchy';

class EnvironmentCard extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    deleteEnvironment: PropTypes.func.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
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
    const { model, match, deleteEnvironment, fetchEnvironments, hierarchyActions } = this.props;
    const name = model.description || model.name;
    const onDeleteSuccess = () => fetchEnvironments(match.params.fqon, match.params.workspaceId);

    hierarchyActions.confirmDelete(() => {
      deleteEnvironment(match.params.fqon, model.id, onDeleteSuccess);
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
    const created = t('general.verbs.created').toLowerCase();
    const modified = t('general.verbs.modified').toLowerCase();

    return (
      <Card
        id={`${model.name}--environment`}
        key={model.id}
        onClick={this.navEnvironmentDetails}
        raise
        typeColor={theme.environmentCard}
        typeSymbol="E"
        menuActions={[
          {
            title: t('general.verbs.edit'),
            icon: <FontIcon>edit</FontIcon>,
            onClick: this.edit,
          },
          {
            title: 'Entitlements',
            icon: <EntitlementIcon size={20} />,
            onClick: this.showEntitlements,
          },
          {
            title: t('general.verbs.delete'),
            icon: <FontIcon>delete_sweep</FontIcon>,
            onClick: this.delete,
          }
        ]}
      >
        <CardTitle
          title={title}
          subTitle={
            [
              <Subtitle key="environment--type">{model.properties.environment_type}</Subtitle>,
              <Subtitle key="environment--owner">owner: {model.owner.name}</Subtitle>,
              <Subtitle key="environment--created">{created}: <FormattedRelative value={model.created.timestamp} /></Subtitle>,
              <Subtitle key="environment--modified">{modified}: <FormattedRelative value={model.modified.timestamp} /></Subtitle>,
            ]
          }
        />
      </Card>
    );
  }
}

export default compose(
  withMetaResource,
  withHierarchy,
  withEntitlements,
  withTheme,
  translate(),
)(EnvironmentCard);
