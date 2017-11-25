import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { withMetaResource } from 'Modules/MetaResource';
import { Button } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { FormattedRelative } from 'react-intl';
import { Subtitle } from 'components/Typography';
import withHierarchy from '../withHierarchy';

class WorkspaceCard extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    deleteWorkspace: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
  };

  navWorkspaceDetails = (e) => {
    e.stopPropagation();
    const { model, match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${model.id}/environments`);
  }

  edit = (e) => {
    e.stopPropagation();
    const { model, match, history } = this.props;

    history.push({ pathname: `/${match.params.fqon}/hierarchy/${model.id}/edit`, state: { modal: true, card: true } });
  }

  delete = (e) => {
    e.stopPropagation();
    const { model, match, deleteWorkspace, fetchOrgSet, hierarchyActions } = this.props;
    const name = model.description || model.name;
    const onDeleteSuccess = () => fetchOrgSet(match.params.fqon);

    hierarchyActions.confirmDelete(() => {
      deleteWorkspace(match.params.fqon, model.id, onDeleteSuccess);
    }, name, 'Workspace');
  }

  render() {
    const { t, model, theme } = this.props;
    const title = model.description || model.name;
    const owner = t('general.nouns.owner').toLowerCase();
    const created = t('general.verbs.created').toLowerCase();
    const modified = t('general.verbs.modified').toLowerCase();

    return (
      <Card id={`${model.name}--workspace`} key={model.id} onClick={this.navWorkspaceDetails} raise typeSymbol="W" typeColor={theme.workspaceCard}>
        <CardTitle
          title={title}
          subtitle={
            [
              <Subtitle key="workspace--ownser">{owner}: {model.owner.name}</Subtitle>,
              <Subtitle key="workspace--created">{created}: <FormattedRelative value={model.created.timestamp} /></Subtitle>,
              <Subtitle key="workspace--modified">{modified}: <FormattedRelative value={model.modified.timestamp} /></Subtitle>,
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
            onClick={this.edit}
          >
            edit
          </Button>
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
)(WorkspaceCard);
