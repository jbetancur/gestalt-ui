import React from 'react';
import PropTypes from 'prop-types';
import { MenuButton, ListItem, FontIcon, Divider } from 'react-md';
import { ActionsMenu } from 'Modules/Actions';
import { withEntitlements } from 'Modules/Entitlements';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const LambdaMenuActions = ({ row, fqon, onDelete, entitlementActions, editURL, actions, actionsPending }) => {
  const handleDelete = () => {
    onDelete(row);
  };

  const handleEntitlements = () => {
    entitlementActions.showEntitlementsModal(row.name, fqon, row.id, 'lambdas', 'Lambda');
  };

  return (
    <MenuButton
      id="lambda-menu-actions"
      primary
      icon
      simplifiedMenu={false}
      repositionOnScroll={false}
      position={MenuButton.Positions.TOP_LEFT}
      anchor={{
        x: MenuButton.HorizontalAnchors.INNER_LEFT,
        y: MenuButton.VerticalAnchors.OVERLAP,
      }}
      menuItems={
        <React.Fragment>
          <ListItem
            primaryText="Edit"
            leftIcon={<FontIcon>edit</FontIcon>}
            to={editURL}
            component={Link}
          />
          <ListItem
            primaryText="View Log"
            leftIcon={<FontIcon>subject</FontIcon>}
            to={{
              pathname: '/logs',
              search: `?name=${row.name}&fqon=${fqon}&providerId=${row.properties.provider.id}&logType=lambda&logId=${row.id}`
            }}
            target="_blank"
            component={Link}
          />
          <ListItem
            primaryText="Entitlements"
            leftIcon={<FontIcon>security</FontIcon>}
            onClick={handleEntitlements}
          />
          <CopyToClipboard text={row.id}>
            <ListItem
              primaryText="Copy uuid"
              leftIcon={<FontIcon>content_copy</FontIcon>}
            />
          </CopyToClipboard>
          <ActionsMenu
            icon
            model={row}
            actionList={actions}
            pending={actionsPending}
            fqon={fqon}
          />
          <Divider />
          <ListItem primaryText="Delete" leftIcon={<FontIcon style={{ color: 'red' }}>delete</FontIcon>} onClick={handleDelete} />
        </React.Fragment>
      }
      centered
    >
      more_vert
    </MenuButton>
  );
};

LambdaMenuActions.propTypes = {
  row: PropTypes.object,
  fqon: PropTypes.string.isRequired,
  editURL: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  entitlementActions: PropTypes.object.isRequired,
  actions: PropTypes.array,
  actionsPending: PropTypes.bool,
};

LambdaMenuActions.defaultProps = {
  row: {},
  actions: [],
  actionsPending: false,
};

export default withEntitlements(LambdaMenuActions);
