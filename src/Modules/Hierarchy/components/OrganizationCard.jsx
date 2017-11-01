import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
import { withMetaResource } from 'Modules/MetaResource';
import { Button } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { FormattedRelative } from 'react-intl';
import { Subtitle } from 'components/Typography';
import withHierarchy from '../withHierarchy';

class OrganizationCard extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    deleteOrg: PropTypes.func.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
  };

  navTo = (e) => {
    e.stopPropagation();
    const { model, history } = this.props;

    history.push(`/${model.properties.fqon}/hierarchy`);
  }

  edit = (e) => {
    e.stopPropagation();
    const { model, history } = this.props;

    history.push({ pathname: `/${model.properties.fqon}/editOrganization`, state: { modal: true, card: true } });
  }

  delete = (e) => {
    e.stopPropagation();
    const { model, match, deleteOrg, fetchOrgSet, hierarchyActions } = this.props;
    const name = model.description || model.name;
    const onDeleteSuccess = () => fetchOrgSet(match.params.fqon);

    hierarchyActions.confirmDelete(() => {
      deleteOrg(model.properties.fqon, onDeleteSuccess);
    }, name, 'Organization');
  }

  render() {
    const { t, model, theme } = this.props;
    const title = model.description || model.name;
    const owner = t('general.nouns.owner').toLowerCase();
    const created = t('general.verbs.created').toLowerCase();
    const modified = t('general.verbs.modified').toLowerCase();

    return (
      <Card key={model.id} onClick={this.navTo} raise typeSymbol="O" typeColor={theme.organizationCard}>
        <CardTitle
          title={title}
          subtitle={
            [
              <Subtitle key="organization--fqon">{model.properties.fqon}</Subtitle>,
              model.owner.name && <Subtitle key="organization--owner" block>{owner}: {model.owner.name}</Subtitle>,
              <Subtitle key="organization--created">{created}: <FormattedRelative value={model.created.timestamp} /></Subtitle>,
              <Subtitle key="organization--modified">{modified}: <FormattedRelative value={model.modified.timestamp} /></Subtitle>,
            ]}
        />
        <CardActions>
          <Button
            tooltipLabel={t('general.verbs.delete')}
            icon
            iconChildren="delete_sweep"
            onClick={this.delete}
          />
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

export default compose(
  withMetaResource,
  withHierarchy,
  withTheme,
  translate(),
)(OrganizationCard);
