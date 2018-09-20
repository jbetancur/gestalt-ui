import React from 'react';
import PropTypes from 'prop-types';
import { MenuButton, ListItem } from 'react-md';
import { Link, withRouter } from 'react-router-dom';
import policyTypes from '../lists/policyTypes';


const generateListItems = match => (
  policyTypes.map(type => (
    <ListItem
      key={type.value}
      primaryText={type.displayName}
      component={Link}
      to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies/${match.params.policyId}/rules/create${type.name}Rule`}
    />)));

const PolicyTypesMenu = ({ match }) => (
  <MenuButton
    id="add-policyRule"
    key="add-policyRule"
    flat
    sameWidth
    primary
    position="below"
    iconBefore={false}
    menuItems={generateListItems(match)}
    iconChildren="expand_more"
    style={{ marginLeft: '.1em' }}
  >
    Add Policy Rule
  </MenuButton>
);

PolicyTypesMenu.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(PolicyTypesMenu);
