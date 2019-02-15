import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { MenuButton, ListItem, FontIcon, Divider } from 'react-md';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import { getLastFromSplit } from 'util/helpers/strings';

const GenericMenuActions = ({ row, rowNameField, fqon, onDelete, editURL, entityKey, disableEntitlements, disableCopy }) => {
  const { showModal } = useContext(ModalContext);

  const handleDelete = () => {
    onDelete(row);
  };

  const handleEntitlements = () => {
    showModal(EntitlementModal, {
      title: `Entitlements for "${get(row, rowNameField)}" ${getLastFromSplit(row.resource_type)}`,
      fqon,
      entityId: row.id,
      entityKey,
    });
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
          {!disableCopy &&
            <CopyToClipboard text={row.id}>
              <ListItem
                primaryText="Copy uuid"
                leftIcon={<FontIcon>content_copy</FontIcon>}
              />
            </CopyToClipboard>}
          {!disableEntitlements && !disableCopy && <Divider />}
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
  rowNameField: PropTypes.string,
  fqon: PropTypes.string,
  editURL: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  entityKey: PropTypes.string.isRequired,
  disableEntitlements: PropTypes.bool,
  disableCopy: PropTypes.bool,
};

GenericMenuActions.defaultProps = {
  row: {},
  rowNameField: 'name',
  fqon: null,
  editURL: null,
  disableEntitlements: false,
  disableCopy: false,
};

export default GenericMenuActions;
