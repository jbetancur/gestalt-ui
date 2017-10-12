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
    contextManagerActions: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unloadNavigation: PropTypes.func.isRequired,
  };

  navWorkspaceDetails = () => {
    const { model, history, contextManagerActions, unloadNavigation } = this.props;

    history.push(`/${model.org.properties.fqon}/hierarchy/${model.id}`);
    contextManagerActions.setCurrentWorkspaceContext(model);
    unloadNavigation('workspace');
  }

  edit = (e) => {
    e.stopPropagation();

    const { model, history } = this.props;

    history.push(`/${model.org.properties.fqon}/hierarchy/${model.id}/editWorkspace`);
  }

  render() {
    const { t, model, theme } = this.props;
    const title = model.description || model.name;

    return (
      <Card key={model.id} onClick={this.navWorkspaceDetails} raise typeSymbol="W" typeColor={theme.workspaceCard}>
        <CardTitle
          title={title}
          subtitle={
            [
              <div>owner: {model.owner.name}</div>,
              <div>created <FormattedRelative value={model.created.timestamp} /></div>,
              <div>modified <FormattedRelative value={model.modified.timestamp} /></div>,
            ]
          }
        />
        <CardActions>
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

export default withTheme(translate()(withContext(WorkspaceCard)));
