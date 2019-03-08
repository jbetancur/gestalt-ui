import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { MenuButton } from 'react-md';
import EditIcon from '@material-ui/icons/Edit';
import Divider from 'components/Divider';
import { DeleteIcon, EntitlementIcon, WorkspaceIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';

class WorkspaceDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  // TODO: will fix when react-router fixes hoisting error
  // static contextType = ModalConsumer;

  showEntitlements = () => {
    const { hierarchyContext } = this.props;
    const { showModal } = this.context;
    const { context: { workspace } } = hierarchyContext;

    const name = workspace.description || workspace.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Workspace`,
      fqon: workspace.org.properties.fqon,
      entityId: workspace.id,
      entityKey: 'workspaces',
    });
  }

  delete = () => {
    const { hierarchyContext, match, history, hierarchyContextActions } = this.props;
    const { showModal } = this.context;
    const { context: { workspace } } = hierarchyContext;
    const name = workspace.description || workspace.name;
    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Workspace`,
      values: { name, type: 'Workspace' },
      requireConfirm: true,
      important: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteWorkspace({ fqon: match.params.fqon, resource: workspace, onSuccess, params: { force } }),
    });
  }

  renderMenuItems() {
    const { hierarchyContext } = this.props;
    const { context: { workspace } } = hierarchyContext;

    return [
      {
        id: 'workspace-menu-entitlements',
        key: 'workspace-menu-entitlements',
        primaryText: 'Entitlements',
        leftIcon: <EntitlementIcon size={20} />,
        onClick: this.showEntitlements,
      },
      {
        id: 'workspace-menu-edit',
        key: 'workspace-menu-edit',
        primaryText: 'Edit',
        leftIcon: <EditIcon color="action" fontSize="small" />,
        component: Link,
        to: { pathname: `/${workspace.org.properties.fqon}/hierarchy/${workspace.id}/edit`, state: { modal: true } },
      },
      <Divider key="workspace-menu-divider-1" />,
      {
        id: 'workspace-menu-delete',
        key: 'workspace-menu-delete',
        primaryText: 'Delete',
        leftIcon: <DeleteIcon size={20} />,
        onClick: this.delete,
      }
    ];
  }

  renderActions() {
    return (
      <MenuButton
        id="workspace--details--actions"
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
    const { context: { workspace } } = hierarchyContext;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={`${workspace.description || workspace.name} Details`}
          titleIcon={<WorkspaceIcon />}
          actions={this.renderActions()}
        />
        <DetailsPane model={workspace} singleRow />
      </React.Fragment>
    );
  }
}

export default withRouter(WorkspaceDetails);

// TODO: Place here to fix hoisting issue
WorkspaceDetails.contextType = ModalConsumer;
