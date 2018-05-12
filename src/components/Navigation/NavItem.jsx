import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'components/Links';
import styled, { withTheme } from 'styled-components';

const NavLinkStyle = styled(NavLink)`
  height: 56px;
  text-decoration: none;
  display: block;
  color: inherit;
  width: 100%;
  font-size: 12px;
  cursor: pointer;

  &.active-link * {
    color: ${props => props.theme.colors['$md-blue-500']} !important;
  }
`;

const Text = styled.div`
  color: ${props => props.theme.colors['$md-grey-900']};
  font-size: 0.65em;
  margin-top: 4px;
  text-align: center;
  white-space: normal;
  text-transform: uppercase;
`;

const NavItem = ({ icon, title, isVisible, ...rest }) => (
  isVisible ?
    <NavLinkStyle {...rest}>
      {icon}
      <Text>{title}</Text>
    </NavLinkStyle>
    : null
);

NavItem.propTypes = {
  icon: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  isVisible: PropTypes.bool,
};

NavItem.defaultProps = {
  isVisible: true,
};

export default withTheme(NavItem);
