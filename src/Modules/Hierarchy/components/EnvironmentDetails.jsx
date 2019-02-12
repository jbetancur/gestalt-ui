import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { MenuButton, FontIcon, Divider } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, EnvironmentIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';

class EnvironmentDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { hierarchyContext, match, entitlementActions } = this.props;
    const { context: { environment } } = hierarchyContext;
    const name = environment.description || environment.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, environment.id, 'environments', 'Environment');
  }

  delete = () => {
    const { hierarchyContext, match, history, hierarchyContextActions, hierarchyActions } = this.props;
    const { context: { environment } } = hierarchyContext;
    const name = environment.description || environment.name;
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    hierarchyActions.confirmDelete(({ force }) => {
      hierarchyContextActions.deleteEnvironment({ fqon: match.params.fqon, resource: environment, onSuccess, params: { force } });
    }, name, 'Environment');
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

export default compose(
  withRouter,
  withHierarchy,
  withEntitlements,
)(EnvironmentDetails);
