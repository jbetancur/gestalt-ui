import React from 'react';
import PropTypes from 'prop-types';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Link, withRouter } from 'react-router-dom';
import policyTypes from '../lists/policyTypes';


const generateListItems = match => (
  policyTypes.map(type => (
    <ListItem
      key={type.value}
      button
      component={Link}
      to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}/rules/create${type.name}Rule`}
    >
      <ListItemText primary={type.displayName} />
    </ListItem>
  )));

const PolicyTypesMenu = ({ match }) => (
  <MenuButton
    id="add-policyRule"
    flat
    flatColor="info"
    label="Add Policy Rule"
    iconAfter
    icon={<ArrowDropDownIcon fontSize="small" />}
  >
    {generateListItems(match)}
  </MenuButton>
);

PolicyTypesMenu.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(PolicyTypesMenu);
