import React from 'react';
import PropTypes from 'prop-types';
import { MenuButton, ListItem, FontIcon, Divider } from 'react-md';
import { withEntitlements } from 'Modules/Entitlements';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getLastFromSplit } from 'util/helpers/strings';

const GenericMenuActions = ({ row, fqon, onDelete, entitlementActions, editURL, entityKey, disableEntitlements }) => {
  const handleDelete = () => {
    onDelete(row);
  };

  const handleEntitlements = () => {
    entitlementActions.showEntitlementsModal(row.name, fqon, row.id, entityKey, getLastFromSplit(row.resource_type));
  };

  return (
    <MenuButton
      id={`${entityKey}--menu-actions`}
      key={`${entityKey}--menu-actions`}
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
          {editURL ?
            <ListItem
              primaryText="Edit"
              leftIcon={<FontIcon>edit</FontIcon>}
              to={editURL}
              component={Link}
            /> : <div />}
          {!disableEntitlements ?
            <ListItem
              primaryText="Entitlements"
              leftIcon={<FontIcon>security</FontIcon>}
              onClick={handleEntitlements}
            /> : <div />}
          <CopyToClipboard text={row.id}>
            <ListItem
              primaryText="Copy uuid"
              leftIcon={<FontIcon>content_copy</FontIcon>}
            />
          </CopyToClipboard>
          <Divider />
          <ListItem
            primaryText="Delete"
            leftIcon={<FontIcon style={{ color: 'red' }}>delete</FontIcon>}
            onClick={handleDelete}
          />
        </React.Fragment>
      }
      centered
    >
      more_vert
    </MenuButton>
  );
};

GenericMenuActions.propTypes = {
  row: PropTypes.object,
  fqon: PropTypes.string.isRequired,
  editURL: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  entitlementActions: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  disableEntitlements: PropTypes.bool,
};

GenericMenuActions.defaultProps = {
  row: {},
  disableEntitlements: false,
  editURL: null,
};

export default withEntitlements(GenericMenuActions);
