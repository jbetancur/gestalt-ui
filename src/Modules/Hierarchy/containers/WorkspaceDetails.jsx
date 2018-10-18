import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { MenuButton, FontIcon, Divider } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, WorkspaceIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';

const Title = styled.div`
  display: flex;
  align-items: center;
`;

class WorkspaceDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { context: { workspace }, match, entitlementActions } = this.props;

    const name = workspace.description || workspace.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, workspace.id, 'workspaces', 'Workspace');
  }

  delete = () => {
    const { context: { workspace }, match, history, contextActions, hierarchyActions } = this.props;
    const name = workspace.description || workspace.name;
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy`);

    hierarchyActions.confirmDelete(({ force }) => {
      contextActions.deleteWorkspace({ fqon: match.params.fqon, resource: workspace, onSuccess, params: { force } });
    }, name, 'Workspace');
  }

  renderMenuItems() {
    const { match } = this.props;

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
        leftIcon: <FontIcon>edit</FontIcon>,
        component: Link,
        to: { pathname: `${match.url}/edit`, state: { modal: true } },
      },
      <Divider key="workspace-menu-divider-1" />,
      {
        id: 'workspace-menu-delete',
        key: 'workspace-menu-delete',
        primaryText: 'Delete',
        leftIcon: <DeleteIcon />,
        onClick: this.delete,
      }
    ];
  }

  renderActions() {
    return (
      <MenuButton
        id="workspace--details--actions"
        icon
        primary
        anchor={{
          x: MenuButton.HorizontalAnchors.INNER_LEFT,
          y: MenuButton.VerticalAnchors.BOTTOM,
        }}
        simplifiedMenu={false}
        menuItems={this.renderMenuItems()}
      >
        more_vert
      </MenuButton>
    );
  }

  render() {
    const { context: { workspace } } = this.props;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={(
            <Title>
              {workspace.description || workspace.name}
              {this.renderActions()}
            </Title>
          )}
          titleIcon={<WorkspaceIcon />}
        />
        <DetailsPane model={workspace} singleRow />
      </React.Fragment>
    );
  }
}

export default compose(
  withHierarchy,
  withEntitlements,
)(WorkspaceDetails);
