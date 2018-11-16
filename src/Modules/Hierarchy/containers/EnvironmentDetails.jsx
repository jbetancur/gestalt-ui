import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { MenuButton, FontIcon, Divider } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';

class EnvironmentDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    contextActions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
    entitlementActions: PropTypes.object.isRequired,
  };

  showEntitlements = () => {
    const { context: { environment }, match, entitlementActions } = this.props;

    const name = environment.description || environment.name;
    entitlementActions.showEntitlementsModal(name, match.params.fqon, environment.id, 'environments', 'Environment');
  }

  delete = () => {
    const { context: { environment }, match, history, contextActions, hierarchyActions } = this.props;
    const name = environment.description || environment.name;
    const onSuccess = () =>
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments`);

    hierarchyActions.confirmDelete(({ force }) => {
      contextActions.deleteEnvironment({ fqon: match.params.fqon, resource: environment, onSuccess, params: { force } });
    }, name, 'Environment');
  }

  renderMenuItems() {
    const { context: { environment } } = this.props;

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
    const { context: { environment } } = this.props;
    const environmentType = environment.id && environment.properties ? environment.properties.environment_type : null;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={`${environment.description || environment.name} Details`}
          subtitle={`type: ${environmentType}`}
          actions={this.renderActions()}
        />
        <DetailsPane model={environment} singleRow />
      </React.Fragment>
    );
  }
}

export default compose(
  withHierarchy,
  withEntitlements,
)(EnvironmentDetails);
