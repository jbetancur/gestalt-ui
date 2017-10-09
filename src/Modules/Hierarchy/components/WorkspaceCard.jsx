import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { withContext } from 'Modules/ContextManagement';
import { Button } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { FormattedRelative } from 'react-intl';

class WorkspaceCard extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unloadNavigation: PropTypes.func.isRequired,
  };

  navWorkspaceDetails(item) {
    const { history, match, contextManagerActions, unloadNavigation } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${item.id}`);
    contextManagerActions.setCurrentWorkspaceContext(item);
    unloadNavigation('workspace');
  }

  edit(e, workspace) {
    e.stopPropagation();

    const { match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${workspace.id}/editWorkspace`);
  }

  render() {
    const { t, model, theme } = this.props;

    return (
      <Card key={model.id} onClick={e => this.navWorkspaceDetails(model, e)} raise typeSymbol="W" typeColor={theme.workspaceCard}>
        <CardTitle
          title={model.description || model.name}
          subtitle={
            <div>
              <div className="gf-caption">owner: {model.owner.name}</div>
              <div className="gf-caption">created <FormattedRelative value={model.created.timestamp} /></div>
              <div className="gf-caption">modified <FormattedRelative value={model.modified.timestamp} /></div>
            </div>
          }
        />
        <CardActions>
          <Button
            tooltipLabel={t('general.verbs.edit')}
            icon
            onClick={e => this.edit(e, model)}
          >
            edit
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withTheme(translate()(withContext(WorkspaceCard)));
