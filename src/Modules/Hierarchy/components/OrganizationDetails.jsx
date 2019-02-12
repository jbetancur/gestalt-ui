import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { MenuButton, FontIcon, Divider } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, OrganizationIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';
import withSelf from '../../../App/hocs/withSelf';

class OrganizationDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { hierarchyContext, match, entitlementActions } = this.props;
    const { context: { organization } } = hierarchyContext;

    const name = organization.description || organization.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, null, null, 'Organization');
  }

  delete = (e) => {
    e.stopPropagation();
    const { hierarchyContext, history, hierarchyContextActions, hierarchyActions } = this.props;
    const { context: { organization } } = hierarchyContext;
    const name = organization.description || organization.name;
    const onSuccess = () => history.replace(`/${organization.org.properties.fqon}/hierarchy`);

    hierarchyActions.confirmDelete(({ force }) => {
      hierarchyContextActions.deleteOrg({ fqon: organization.properties.fqon, resource: organization, onSuccess, params: { force } });
    }, name, 'Organization');
  }

  renderMenuItems() {
    const { match, hierarchyContext, self } = this.props;
    const { context: { organization } } = hierarchyContext;
    const deleteDisabled = match.params.fqon === self.properties.gestalt_home || match.params.fqon === 'root';

    return [
      {
        id: 'organization-menu-entitlements',
        key: 'organization-menu-entitlements',
        primaryText: 'Entitlements',
        leftIcon: <EntitlementIcon size={20} />,
        onClick: this.showEntitlements,
      },
      {
        id: 'organization-menu-edit',
        key: 'organization-menu-edit',
        primaryText: 'Edit',
        leftIcon: <FontIcon>edit</FontIcon>,
        component: Link,
        to: { pathname: `/${organization.properties.fqon}/editOrganization`, state: { modal: true } },
      },
      <Divider key="organization-menu-divider-1" />,
      {
        id: 'organization-menu-delete',
        key: 'organization-menu-delete',
        primaryText: 'Delete',
        leftIcon: <DeleteIcon />,
        onClick: this.delete,
        disabled: deleteDisabled,
      }
    ];
  }

  renderActions() {
    return (
      <MenuButton
        id="org--details--actions"
        flat
        primary
        iconBefore={false}
        iconChildren="arrow_drop_down"
        anchor={{
          x: MenuButton.HorizontalAnchors.INNER_RIGHT,
          y: MenuButton.VerticalAnchors.BOTTOM,
        }}
        simplifiedMenu={false}
        menuItems={this.renderMenuItems()}
      >
        Actions
      </MenuButton>
    );
  }

  render() {
    const { hierarchyContext } = this.props;
    const { context: { organization } } = hierarchyContext;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={`${organization.description || organization.name} Details`}
          titleIcon={<OrganizationIcon />}
          subtitle={`fqon: ${organization.properties.fqon}`}
          actions={this.renderActions()}
        />
        <DetailsPane model={organization} singleRow />
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  withSelf,
  withHierarchy,
  withEntitlements,
)(OrganizationDetails);
