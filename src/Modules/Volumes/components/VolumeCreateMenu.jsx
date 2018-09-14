import React from 'react';
import PropTypes from 'prop-types';
import { MenuButton, ListItem } from 'react-md';

const generateListItems = onSelect => (
  [{ name: 'Create New', value: 'create' }, { name: 'Attach Existing', value: 'attach' }].map(type => (
    <ListItem
      key={type.value}
      primaryText={type.name}
      onClick={() => onSelect(type)}
    />)));

const VolumeCreateMenu = ({ onSelect }) => (
  <MenuButton
    id="add-volumeitem"
    key="add-volumeitem"
    flat
    sameWidth
    primary
    position="below"
    iconBefore={false}
    menuItems={generateListItems(onSelect)}
    iconChildren="expand_more"
  >
    Add Volume
  </MenuButton>
);

VolumeCreateMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default VolumeCreateMenu;
