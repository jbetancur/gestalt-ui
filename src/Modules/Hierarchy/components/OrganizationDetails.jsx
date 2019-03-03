import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { MenuButton, FontIcon } from 'react-md';
import Divider from 'components/Divider';
import { DeleteIcon, EntitlementIcon, OrganizationIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import withSelf from '../../../App/hocs/withSelf';

class OrganizationDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
  };

  // TODO: will fix when react-router fixes hoisting error
  // static contextType = ModalConsumer;

  showEntitlements = () => {
    const { hierarchyContext } = this.props;
    const { context: { organization } } = hierarchyContext;
    const { showModal } = this.context;
    const name = organization.description || organization.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Organization`,
      fqon: organization.properties.fqon,
      entityId: null,
      entityKey: null,
    });
  }

  delete = (e) => {
    e.stopPropagation();
    const { hierarchyContext, history, hierarchyContextActions } = this.props;
    const { context: { organization } } = hierarchyContext;
    const { showModal } = this.context;
    const name = organization.description || organization.name;
    const onSuccess = () => history.replace(`/${organization.org.properties.fqon}/hierarchy`);

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Organization`,
      values: { name, type: 'Environment' },
      requireConfirm: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteOrg({ fqon: organization.properties.fqon, resource: organization, onSuccess, params: { force } }),
    });
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
)(OrganizationDetails);

// TODO: Place here to fix hoisting issue
OrganizationDetails.contextType = ModalConsumer;
