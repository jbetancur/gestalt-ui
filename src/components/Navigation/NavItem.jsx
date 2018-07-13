import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
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
`;

const Text = styled.div`
  color: ${props => props.theme.colors['$md-grey-900']};
  font-size: 0.65em;
  margin-top: 4px;
  text-align: center;
  white-space: normal;
  text-transform: uppercase;
`;

class NavItem extends Component {
  static propTypes = {
    icon: PropTypes.object.isRequired,
    title: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    isVisible: PropTypes.bool,
    history: PropTypes.object.isRequired,
    to: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
  };

  static defaultProps = {
    isVisible: true,
  };

  checkIfShouldNav = (e) => {
    const { history, to } = this.props;
    let route = to;

    if (typeof to === 'object') {
      route = to.pathname;
    }

    if (history.location.pathname === route) {
      e.preventDefault();
    }
  }

  render() {
    const { icon, title, isVisible, ...rest } = this.props;

    return (
      isVisible ?
        <NavLinkStyle onClick={this.checkIfShouldNav} {...rest}>
          {icon}
          <Text>{title}</Text>
        </NavLinkStyle>
        : null
    );
  }
}

export default withTheme(withRouter(NavItem));
