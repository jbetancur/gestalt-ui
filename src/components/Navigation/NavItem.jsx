import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';

const EnhancedListItem = styled(NavLink)`
  height: 56px;
  text-decoration: none;
  display: flex;
  color: inherit;
  width: 100%;
  font-size: 12px;
  cursor: pointer;

  &.active-link * {
    color: ${props => props.theme.colors['$md-blue-500']} !important;
  }
`;

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
`;

const Text = styled.div`
  color: ${props => props.theme.colors['$md-grey-900']};
  font-size: 0.7em;
  margin-top: 6px;
  padding-bottom: 1em;
  text-align: center;
  white-space: normal;
  text-transform: uppercase;
`;

const NavItem = ({ icon, title, isVisible, ...rest }) => (
  isVisible ? <EnhancedListItem {...rest}>
    <Wrapper>
      <div>{icon}</div>
      <Text>{title}</Text>
    </Wrapper>
  </EnhancedListItem> : null
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
