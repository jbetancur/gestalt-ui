import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { MenuButton, ListItem, FontIcon, Divider } from 'react-md';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';

const LambdaMenuActions = ({ row, fqon, onDelete, editURL }) => {
  const { showModal } = useContext(ModalContext);

  const handleDelete = () => {
    onDelete(row);
  };

  const handleEntitlements = () => {
    showModal(EntitlementModal, {
      title: `Entitlements for "${row.name}" Lambda`,
      fqon: row.org.properties.fqon,
      entityId: row.id,
      entityKey: 'lambdas',
    });
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
};

LambdaMenuActions.defaultProps = {
  row: {},
};

export default LambdaMenuActions;
