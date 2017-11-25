import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withTheme } from 'styled-components';
import { translate } from 'react-i18next';
import { withMetaResource } from 'Modules/MetaResource';
import { FormattedRelative } from 'react-intl';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { Button } from 'components/Buttons';
import { Subtitle } from 'components/Typography';
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
  };

  navEnvironmentDetails = () => {
    const { model, match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}/containers`);
  }

  edit = (e) => {
    const { model, match, history } = this.props;

    e.stopPropagation();
    history.push({ pathname: `/${match.params.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}/edit`, state: { modal: true, card: true } });
  }

  delete = (e) => {
    e.stopPropagation();
    const { model, match, deleteEnvironment, fetchEnvironments, hierarchyActions } = this.props;
    const name = model.description || model.name;
    const onDeleteSuccess = () => fetchEnvironments(match.params.fqon, match.params.workspaceId);

    hierarchyActions.confirmDelete(() => {
      deleteEnvironment(match.params.fqon, model.id, onDeleteSuccess);
    }, name, 'Environment');
  }


  render() {
    const { model, t, theme } = this.props;
    const title = model.description || model.name;
    const owner = t('general.nouns.owner').toLowerCase();
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
      >
        <CardTitle
          title={title}
          subtitle={
            [
              <Subtitle key="environment--type">type: {model.properties.environment_type}</Subtitle>,
              <Subtitle key="environment--workspace">workspace: {model.properties.workspace && model.properties.workspace.name}</Subtitle>,
              <Subtitle key="environment--owner">{owner}: {model.owner.name}</Subtitle>,
              <Subtitle key="environment--created">{created}: <FormattedRelative value={model.created.timestamp} /></Subtitle>,
              <Subtitle key="environment--modified">{modified}: <FormattedRelative value={model.modified.timestamp} /></Subtitle>,
            ]
          }
        />
        <CardActions>
          <Button
            tooltipLabel={t('general.verbs.delete')}
            icon
            iconChildren="delete_sweep"
            onClick={this.delete}
          />
          <Button
            tooltipLabel={t('general.verbs.edit')}
            icon
            iconChildren="edit"
            onClick={this.edit}
          />
        </CardActions>
      </Card>
    );
  }
}

export default compose(
  withMetaResource,
  withHierarchy,
  withTheme,
  translate(),
)(EnvironmentCard);
