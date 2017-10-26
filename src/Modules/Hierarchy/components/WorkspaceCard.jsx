import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { withContext } from 'Modules/ContextManagement';
import { Button } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { FormattedRelative } from 'react-intl';
import { Subtitle } from 'components/Typography';

class WorkspaceCard extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  navWorkspaceDetails = () => {
    const { model, history, contextManagerActions } = this.props;

    history.push(`/${model.org.properties.fqon}/hierarchy/${model.id}/environments`);
    contextManagerActions.setCurrentWorkspaceContext(model);
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
              <Subtitle key="workspace--ownser">owner: {model.owner.name}</Subtitle>,
              <Subtitle key="workspace--created">created: <FormattedRelative value={model.created.timestamp} /></Subtitle>,
              <Subtitle key="workspace--modified">modified: <FormattedRelative value={model.modified.timestamp} /></Subtitle>,
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
