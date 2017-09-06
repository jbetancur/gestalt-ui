import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { Button } from 'components/Buttons';

class EnvironmentCard extends PureComponent {
  static propTypes = {
    onNavigationToggle: PropTypes.func.isRequired,
    onEditToggle: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
  };

  render() {
    const { model, t, theme } = this.props;

    return (
      <Card
        onClick={e => this.props.onNavigationToggle(model, e)}
        raise
        typeColor={theme.environmentCard}
      >
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
            onClick={e => this.props.onEditToggle(e, model)}
          >
            edit
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default EnvironmentCard;
