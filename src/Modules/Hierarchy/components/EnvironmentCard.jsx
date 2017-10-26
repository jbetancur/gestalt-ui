import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { translate } from 'react-i18next';
import { FormattedRelative } from 'react-intl';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { Button } from 'components/Buttons';
import { Subtitle } from 'components/Typography';

class EnvironmentCard extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
  };

  navEnvironmentDetails = () => {
    const { model, history, contextManagerActions } = this.props;

    history.push(`/${model.org.properties.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}/containers`);
    contextManagerActions.setCurrentEnvironmentContext(model);
  }

  edit = (e) => {
    const { model, history } = this.props;

    e.stopPropagation();
    history.push(`/${model.org.properties.fqon}/hierarchy/${model.properties.workspace.id}/environment/${model.id}/edit`);
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
              <Subtitle key="environment--type">type: {model.properties.environment_type}</Subtitle>,
              <Subtitle key="environment--workspace">workspace: {model.properties.workspace && model.properties.workspace.name}</Subtitle>,
              <Subtitle key="environment--owner">owner: {model.owner.name}</Subtitle>,
              <Subtitle key="environment--created">created: <FormattedRelative value={model.created.timestamp} /></Subtitle>,
              <Subtitle key="environment--modified">modified: <FormattedRelative value={model.modified.timestamp} /></Subtitle>,
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
