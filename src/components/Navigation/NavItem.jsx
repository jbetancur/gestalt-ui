import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';

const EnhancedListItem = styled(({ isVisible, ...rest }) => <NavLink {...rest} />)`
  height: 56px;
  text-decoration: none;
  display: ${props => (props.isVisible ? 'flex' : 'none')};
  align-items: center;

  &.active-link * {
    color:  ${props => props.theme.colors['$md-blue-500']}!important;
  }
`;

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
`;

const Text = styled.div`
  color: ${props => props.theme.colors['$md-grey-900']};
  font-size: .7em;
  margin-top: 6px;
  padding-bottom: 1em;
  text-align: center;
  white-space: normal;
  text-transform: uppercase;
`;

const Icon = styled(FontIcon)`
  font-size: 24px!important;

  svg {
    height: 24px;
    width: 24px;
  }
`;

const NavItem = ({ icon, title, isVisible, ...rest }) => (
  <EnhancedListItem isVisible={isVisible} {...rest}>
    <Wrapper>
      <Icon>{icon}</Icon>
      <Text>{title}</Text>
    </Wrapper>
  </EnhancedListItem>
);

NavItem.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  isVisible: PropTypes.bool,
};

NavItem.defaultProps = {
  isVisible: true,
};

export default withTheme(NavItem);
