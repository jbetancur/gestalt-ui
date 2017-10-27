import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { Button } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { FormattedRelative } from 'react-intl';
import { Subtitle } from 'components/Typography';

class OrganizationCard extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  navTo = (e) => {
    e.stopPropagation();

    const { model, history } = this.props;

    history.push(`/${model.properties.fqon}/hierarchy`);
  }

  edit = (e) => {
    e.stopPropagation();

    const { model, history } = this.props;

    history.push(`/${model.properties.fqon}/editOrganization`);
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
              <Subtitle key="organization--fqon">{model.properties.fqon}</Subtitle>,
              model.owner.name && <Subtitle key="organization--owner" block>{t('general.nouns.owner').toLowerCase()}: {model.owner.name}</Subtitle>,
              <Subtitle key="organization--created">{t('general.verbs.created').toLowerCase()}: <FormattedRelative value={model.created.timestamp} /></Subtitle>,
              <Subtitle key="organization--modified">{t('general.verbs.modified').toLowerCase()}: <FormattedRelative value={model.modified.timestamp} /></Subtitle>,
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
