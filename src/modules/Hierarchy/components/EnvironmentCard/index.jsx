import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import { withTheme } from 'styled-components';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { Button } from 'components/Buttons';

class EnvironmentCard extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    setCurrentEnvironmentContext: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
  };

  navEnvironmentDetails(item) {
    const { match, history, setCurrentEnvironmentContext } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${item.id}`);
    setCurrentEnvironmentContext(item);
  }

  edit(e, environment) {
    e.stopPropagation();

    const { match, history } = this.props;

    history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${environment.id}/edit`);
  }

  render() {
    const { model, t, theme } = this.props;

    return (
      <Card className="flex-4 flex-xs-12" onClick={e => this.navEnvironmentDetails(model, e)} raise typeColor={theme.environmentCard}>
        <CardTitle
          title={model.description || model.name}
          subtitle={
            <div>
              <div className="gf-caption"><span>type: {model.properties.environment_type}</span></div>
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

export default withTheme(EnvironmentCard);
