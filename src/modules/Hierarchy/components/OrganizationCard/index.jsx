import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
  }

  navTo(e, organization, route) {
    e.stopPropagation();

    const { history } = this.props;
    const path = route ? `/${organization.properties.fqon}/${route}` : `/${organization.properties.fqon}`;
    history.push(path);
  }

  edit(e, organization) {
    e.stopPropagation();

    const { history } = this.props;

    history.push(`/${organization.properties.fqon}/editOrganization`);
  }

  render() {
    const { t, model, theme } = this.props;
    const name = model.description || model.name;

    return (
      <Card key={model.id} className="flex-3 flex-xs-12" onClick={e => this.navTo(e, model, 'hierarchy')} raise typeSymbol="O" typeColor={theme.organizationCard}>
        <CardTitle
          title={name}
          subtitle={
            <div>
              <div>{model.properties.fqon}</div>
              {/* TODO: https://gitlab.com/galacticfog/gestalt-meta/issues/185 */}
              {model.owner.name && <div className="gf-caption"><span>{t('general.nouns.owner').toLowerCase()}: {model.owner.name}</span></div>}
              <div className="gf-caption">{t('general.verbs.created').toLowerCase()} <FormattedRelative value={model.created.timestamp} /></div>
              <div className="gf-caption">{t('general.verbs.modified').toLowerCase()} <FormattedRelative value={model.modified.timestamp} /></div>
            </div>}
        />
        <CardActions>
          {/* <Button
            tooltipLabel={t('users.title')}
            icon
            onClick={e => this.navTo(e, model, 'users')}
          >
            person
          </Button>

          <Button
            tooltipLabel={t('groups.title')}
            icon
            onClick={e => this.navTo(e, model, 'groups')}
          >
            group
          </Button> */}

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

export default withTheme(OrganizationCard);
