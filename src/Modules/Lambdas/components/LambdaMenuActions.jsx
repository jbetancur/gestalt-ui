import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import SubjectIcon from '@material-ui/icons/Subject';
import CopyIcon from '@material-ui/icons/FileCopy';
import CloneIcon from '@material-ui/icons/FilterNone';
import DeleteIcon from '@material-ui/icons/Delete';
import { EntitlementIcon } from 'components/Icons';
import Divider from 'components/Divider';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalContext } from 'Modules/ModalRoot/ModalContext';

const LambdaMenuActions = ({ row, fqon, onDelete, onClone, editURL }) => {
  const { showModal } = useContext(ModalContext);

  const handleDelete = () => {
    onDelete(row);
  };

  const handleClone = () => {
    onClone(row);
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
      icon={<MoreVertIcon fontSize="small" color="primary" />}
    >
      <ListItem
        button
        dense
        to={editURL}
        component={Link}
      >
        <EditIcon fontSize="small" color="action" />
        <ListItemText primary="Edit" />
      </ListItem>

      <ListItem
        button
        dense
        component={Link}
        to={{
          pathname: '/logs',
          search: `?name=${row.name}&fqon=${fqon}&providerId=${row.properties.provider.id}&logType=lambda&logId=${row.id}`
        }}
        target="_blank"
      >
        <SubjectIcon fonstSize="small" color="action" />
        <ListItemText primary="View Log" />
      </ListItem>

      <ListItem
        button
        dense
        onClick={handleEntitlements}
      >
        <EntitlementIcon size={22} />
        <ListItemText primary="Entitlements" />
      </ListItem>

      <CopyToClipboard text={row.id}>
        <ListItem button dense>
          <CopyIcon fontSize="small" color="action" />
          <ListItemText primary="Copy UUID" />
        </ListItem>
      </CopyToClipboard>

      <ListItem
        button
        dense
        onClick={handleClone}
      >
        <CloneIcon fontSize="small" color="action" />
        <ListItemText primary="Clone" />
      </ListItem>

      <Divider />

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

LambdaMenuActions.propTypes = {
  row: PropTypes.object,
  fqon: PropTypes.string.isRequired,
  editURL: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClone: PropTypes.func.isRequired,
};

LambdaMenuActions.defaultProps = {
  row: {},
};

export default LambdaMenuActions;
