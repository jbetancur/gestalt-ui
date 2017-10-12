import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { FormattedRelative } from 'react-intl';

class OrganizationCard extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unloadNavigation: PropTypes.func.isRequired,
  };

  navTo = (e) => {
    e.stopPropagation();

    const { model, history, unloadNavigation } = this.props;

    history.push(`/${model.properties.fqon}/hierarchy`);
    unloadNavigation('hierarchy');
  }

  edit = (e) => {
    e.stopPropagation();

    const { model, history } = this.props;

    history.push(`/${model.properties.fqon}/hierarchy/editOrganization`);
  }

  render() {
    const { t, model, theme } = this.props;
    const title = model.description || model.name;

    return (
      <Card key={model.id} onClick={this.navTo} raise typeSymbol="O" typeColor={theme.organizationCard}>
        <CardTitle
          title={title}
          subtitle={
            [
              <div>{model.properties.fqon}</div>,
              model.owner.name && <div><span>{t('general.nouns.owner').toLowerCase()}: {model.owner.name}</span></div>,
              <div>{t('general.verbs.created').toLowerCase()} <FormattedRelative value={model.created.timestamp} /></div>,
              <div>{t('general.verbs.modified').toLowerCase()} <FormattedRelative value={model.modified.timestamp} /></div>,
            ]}
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

export default withTheme(translate()(OrganizationCard));
