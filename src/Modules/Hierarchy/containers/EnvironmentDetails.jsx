import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { MenuButton, FontIcon, Divider } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { DeleteIcon, EntitlementIcon, EnvironmentIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import Label from 'components/Label';
import ActionsToolbar from 'components/ActionsToolbar';
import withHierarchy from '../hocs/withHierarchy';

const Title = styled.div`
  display: flex;
  align-items: center;
`;

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
    const { match } = this.props;

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
        to: { pathname: `${match.url}/edit`, state: { modal: true } },
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
    const { context: { environment } } = this.props;
    const environmentType = environment.id && environment.properties ? environment.properties.environment_type.toUpperCase() : null;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={(
            <Title>
              {environment.description || environment.name}
              {this.renderActions()}
            </Title>
          )}
          titleIcon={<EnvironmentIcon />}
          subtitle={<Label>{environmentType}</Label>}
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
