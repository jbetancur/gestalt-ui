import React from 'react';
import PropTypes from 'prop-types';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const generateListItems = onSelect => (
  [{ name: 'Create New', value: 'create' }, { name: 'Attach Existing', value: 'attach' }].map(type => (
    <ListItem
      key={type.value}
      button
      onClick={() => onSelect(type)}
    >
      <ListItemText primary={type.name} />
    </ListItem>
  )));

const VolumeCreateMenu = ({ onSelect }) => (
  <MenuButton
    id="add-volumeitem"
    flat
    flatColor="info"
    label="Add Volume"
    iconAfter
    icon={<ArrowDropDownIcon fontSize="small" />}
  >
    {generateListItems(onSelect)}
  </MenuButton>
);

VolumeCreateMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default VolumeCreateMenu;
