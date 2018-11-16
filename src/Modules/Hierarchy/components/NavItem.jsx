import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'components/Links';
import styled, { withTheme } from 'styled-components';

const ListItem = styled.li`
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 48px;
  width: 100%;
  cursor: pointer;
  user-select: none;
  color: ${props => props.theme.colors.fontVariant};

  &:hover {
    background-color: ${props => props.theme.colors.primaryVariant};

    .nav-on-menu-hover {
      display: flex;
      position: fixed;
    }
  }
`;

const NavLinkStyle = styled(NavLink)`
  position: relative;
  display: flex;
  padding-right: 20px;
  text-decoration: none;
  color: inherit;
`;

const Icon = styled.div`
  display: inline-block;
  line-height: 0;
  margin: 13px 21px;

  i {
    color: white;
  }

  svg {
    fill: white;
  }
`;

const Text = styled.div`
  line-height: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const SubMenu = styled(({ miniWidth, expandedWidth, ...rest }) => <div {...rest} />)`
  display: none;
  position: absolute;
  padding: 8px;
  height: 48px;
  font-weight: 500;
  box-shadow: 2px 1px 2px -2px rgba(0, 0, 0, 0.1);
  opacity: 0.98;
  left: calc(${props => props.miniWidth} - 1px);
  border-left: 1px solid ${props => props.theme.colors.primary};
  max-width: calc(${props => props.expandedWidth} - ${props => props.miniWidth});
  background-color: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.font};
`;

class NavItem extends Component {
  static propTypes = {
    icon: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    title: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
    open: PropTypes.bool.isRequired,
    expandedWidth: PropTypes.string.isRequired,
    miniWidth: PropTypes.string.isRequired,
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
    const { icon, open, expandedWidth, miniWidth, title, isVisible, ...rest } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <ListItem>
        <NavLinkStyle onClick={this.checkIfShouldNav} {...rest}>
          <Icon>{icon}</Icon>
          <Text>{title}</Text>
          {!open &&
          <SubMenu
            expandedWidth={expandedWidth}
            miniWidth={miniWidth}
            className="nav-on-menu-hover"
          >
            <Text>{title}</Text>
          </SubMenu>}
        </NavLinkStyle>
      </ListItem>
    );
  }
}

export default compose(
  withTheme,
  withRouter,
)(NavItem);
