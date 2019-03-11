import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopy';
import FilterNone from '@material-ui/icons/FilterNone';
import DeleteIcon from '@material-ui/icons/Delete';
import { EntitlementIcon } from 'components/Icons';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';
import Divider from 'components/Divider';
import { getLastFromSplit } from 'util/helpers/strings';

const GenericMenuActions = ({ row, rowNameField, fqon, onDelete, onClone, editURL, entityKey, disableEntitlements, disableCopy }) => {
  const { showModal } = useContext(ModalContext);

  const handleDelete = () => {
    onDelete(row);
  };

  const handleClone = () => {
    onClone(row);
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
      icon={<MoreVertIcon fontSize="small" color="primary" />}
    >
      {editURL && (
        <ListItem
          button
          dense
          to={editURL}
          component={Link}
        >
          <EditIcon fontSize="small" color="action" />
          <ListItemText primary="Edit" />
        </ListItem>
      )}

      {!disableEntitlements && (
        <ListItem
          button
          dense
          onClick={handleEntitlements}
        >
          <EntitlementIcon size={20} />
          <ListItemText primary="Entitlements" />
        </ListItem>
      )}

      {!disableCopy && (
        <CopyToClipboard text={row.id}>
          <ListItem button dense>
            <CopyIcon fontSize="small" color="action" />
            <ListItemText primary="Copy UUID" />
          </ListItem>
        </CopyToClipboard>
      )}

      {onClone && (
        <ListItem
          button
          dense
          onClick={handleClone}
        >
          <FilterNone fontSize="small" color="action" />
          <ListItemText primary="Clone" />
        </ListItem>
      )}

      {!disableEntitlements && !disableCopy && <Divider />}

      <ListItem
        button
        dense
        onClick={handleDelete}
      >
        <DeleteIcon fontSize="small" color="error" />
        <ListItemText primary="Delete" />
      </ListItem>
    </MenuButton>
  );
};

GenericMenuActions.propTypes = {
  row: PropTypes.object,
  rowNameField: PropTypes.string,
  fqon: PropTypes.string,
  editURL: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onClone: PropTypes.func,
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
  onClone: null,
};

export default GenericMenuActions;
