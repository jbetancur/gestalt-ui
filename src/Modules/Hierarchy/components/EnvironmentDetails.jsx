import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { MenuButton, FontIcon, Divider } from 'react-md';
import { DeleteIcon, EntitlementIcon, EnvironmentIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';

class EnvironmentDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  static contextType = ModalConsumer;

  showEntitlements = () => {
    const { hierarchyContext } = this.props;
    const { showModal } = this.context;
    const { context: { environment } } = hierarchyContext;
    const name = environment.description || environment.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Environment`,
      fqon: environment.org.properties.fqon,
      entityId: environment.id,
      entityKey: 'environments',
    });
  }

  delete = () => {
    const { hierarchyContext, match, history, hierarchyContextActions } = this.props;
    const { showModal } = this.context;
    const { context: { environment } } = hierarchyContext;
    const name = environment.description || environment.name;
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Environment`,
      values: { name, type: 'Environment' },
      requireConfirm: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteEnvironment({ fqon: match.params.fqon, resource: environment, onSuccess, params: { force } }),
    });
  }

  renderMenuItems() {
    const { hierarchyContext } = this.props;
    const { context: { environment } } = hierarchyContext;

    return [
      {
        id: 'environment-menu-entitlements',
        key: 'environment-menu-entitlements',
        primaryText: 'Entitlements',
        leftIcon: <EntitlementIcon size={20} />,
        onClick: this.showEntitlements,
      },
      {
        id: 'environment-menu-edit',
        key: 'environment-menu-edit',
        primaryText: 'Edit',
        leftIcon: <FontIcon>edit</FontIcon>,
        component: Link,
        to: { pathname: `/${environment.org.properties.fqon}/hierarchy/${environment.properties.workspace.id}/environment/${environment.id}/edit`, state: { modal: true } },
      },
      <Divider key="organization-menu-divider-1" />,
      {
        id: 'environment-menu-delete',
        key: 'environment-menu-delete',
        primaryText: 'Delete',
        leftIcon: <DeleteIcon />,
        onClick: this.delete,
      }
    ];
  }

  renderActions() {
    return (
      <MenuButton
        id="environment--details--actions"
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
    const { context: { environment } } = hierarchyContext;
    const environmentType = environment.id && environment.properties ? environment.properties.environment_type : null;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={`${environment.description || environment.name} Details`}
          titleIcon={<EnvironmentIcon />}
          subtitle={`type: ${environmentType}`}
          actions={this.renderActions()}
        />
        <DetailsPane model={environment} singleRow />
      </React.Fragment>
    );
  }
}

export default withRouter(EnvironmentDetails);
