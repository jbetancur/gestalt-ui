import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { translate } from 'react-i18next';
import { FormattedRelative } from 'react-intl';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { Button } from 'components/Buttons';

class EnvironmentCard extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    unloadNavigation: PropTypes.func.isRequired,
  };

  navEnvironmentDetails = () => {
    const { model, history, contextManagerActions, unloadNavigation } = this.props;

    history.push(`/${model.org.properties.fqon}/hierarchy/${model.properties.workspace.id}/environments/${model.id}`);
    contextManagerActions.setCurrentEnvironmentContext(model);
    unloadNavigation('environment');
  }

  edit = (e) => {
    const { model, history } = this.props;

    e.stopPropagation();
    history.push(`/${model.org.properties.fqon}/hierarchy/${model.properties.workspace.id}/environments/${model.id}/edit`);
  }

  render() {
    const { model, t, theme } = this.props;
    const title = model.description || model.name;

    return (
      <Card
        onClick={this.navEnvironmentDetails}
        raise
        typeColor={theme.environmentCard}
        typeSymbol="E"
      >
        <CardTitle
          title={title}
          subtitle={
            [
              <div><span>type: {model.properties.environment_type}</span></div>,
              <div><span>workspace: {model.properties.workspace && model.properties.workspace.name}</span></div>,
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
            iconChildren="edit"
            onClick={this.edit}
          />
        </CardActions>
      </Card>
    );
  }
}

export default withTheme(translate()(EnvironmentCard));
