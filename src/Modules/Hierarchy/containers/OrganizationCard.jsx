import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { translate } from 'react-i18next';
import { withTheme } from 'styled-components';
// import { withOrganization } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { FontIcon } from 'react-md';
import { EntitlementIcon, OrganizationIcon } from 'components/Icons';
import Card from '../components/GFCard';
import CardTitle from '../components/GFCardTitle';
import withHierarchy from '../hocs/withHierarchy';
import withContext from '../hocs/withContext';

class OrganizationCard extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    contextActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
  };

  navTo = () => {
    const { model, history } = this.props;

    history.push(`/${model.properties.fqon}/hierarchy`);
  }

  edit = () => {
    const { model, history } = this.props;

    history.push({
      pathname: `/${model.properties.fqon}/editOrganization`,
      state: {
        modal: true,
        card: true,
      },
    });
  }

  delete = () => {
    const { model, contextActions, hierarchyActions } = this.props;
    const name = model.description || model.name;

    hierarchyActions.confirmDelete(({ force }) => {
      contextActions.deleteOrg({ fqon: model.properties.fqon, resource: model, params: { force } });
    }, name, 'Organization');
  }

  showEntitlements = () => {
    const { entitlementActions, model } = this.props;
    const name = model.description || model.name;

    entitlementActions.showEntitlementsModal(name, model.properties.fqon, null, null, 'Organization');
  }

  render() {
    const { t, model, theme } = this.props;
    const title = model.description || model.name;

    return (
      <Card
        id={`${model.name}--organization`}
        key={model.id}
        onClick={this.navTo}
        raise
        cardIcon={<OrganizationIcon size={14} />}
        cardColor={theme.organizationCard}
        created={model.created.timestamp}
        menuActions={[
          {
            id: 'organization-card--edit',
            title: t('general.verbs.edit'),
            icon: <FontIcon>edit</FontIcon>,
            onClick: this.edit,
          },
          {
            id: 'organization-card--entitlements',
            title: 'Entitlements',
            icon: <EntitlementIcon size={20} />,
            onClick: this.showEntitlements,
          },
          {
            id: 'organization-card--delete',
            title: t('general.verbs.delete'),
            icon: <FontIcon>delete_forever</FontIcon>,
            onClick: this.delete,
          }
        ]}
      >
        <CardTitle
          title={title}
          subTitle={model.owner.name}
        />
      </Card>
    );
  }
}

export default compose(
  // withOrganization(),
  withContext(),
  withHierarchy,
  withEntitlements,
  withTheme,
  translate(),
)(OrganizationCard);
