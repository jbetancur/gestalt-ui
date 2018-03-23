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
      anchor={{
        x: MenuButton.HorizontalAnchors.INNER_LEFT,
        y: MenuButton.VerticalAnchors.OVERLAP,
      }}
      menuItems={[
        editURL ?
          <ListItem
            key={`${entityKey}--edit`}
            primaryText="Edit"
            leftIcon={<FontIcon>edit</FontIcon>}
            to={editURL}
            component={Link}
          /> : <div />,
        !disableEntitlements ?
          <ListItem
            key={`${entityKey}--entitlements`}
            primaryText="Entitlements"
            leftIcon={<FontIcon>security</FontIcon>}
            onClick={handleEntitlements}
          /> : <div />,
        <CopyToClipboard
          key={`${entityKey}--copyuuid`}
          text={row.id}
        >
          <ListItem
            primaryText="Copy uuid"
            leftIcon={<FontIcon>content_copy</FontIcon>}
          />
        </CopyToClipboard>,
        <Divider key={`${entityKey}--divider-1`} />,
        <ListItem
          key={`${entityKey}--delete`}
          primaryText="Delete"
          leftIcon={<FontIcon style={{ color: 'red' }}>delete</FontIcon>}
          onClick={handleDelete}
        />,
      ]}
      centered
    >
      more_vert
    </MenuButton>
  );
};

GenericMenuActions.propTypes = {
  row: PropTypes.object,
  fqon: PropTypes.string.isRequired,
  editURL: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  entitlementActions: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  disableEntitlements: PropTypes.bool,
};

GenericMenuActions.defaultProps = {
  row: {},
  disableEntitlements: false,
};

export default withEntitlements(GenericMenuActions);
