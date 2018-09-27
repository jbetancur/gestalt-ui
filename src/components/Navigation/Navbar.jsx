import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import NavItem from './NavItem';

const NavbarContainer = styled.nav`
  position: fixed;
  left: 0;
  top: 56px;
  bottom: 0;
  background-color: white;
  width: 70px;
  border-right: 1px solid ${props => props.theme.colors['$md-grey-200']};
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding-top: 16px;
  height: 100%;
  overflow: visible;
  z-index: 5;
`;

const List = styled.div`
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
`;

class Navbar extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
  };

  static defaultProps = {
    items: [],
  };

  render() {
    const { items } = this.props;

    return (
      <NavbarContainer>
        <List>
          {items.map(item => (
            <NavItem
              title={item.title}
              key={item.key}
              icon={item.icon}
              to={item.to}
              isVisible={item.isVisible}
              activeClassName="active-link"
            >
              {item}
            </NavItem>
          ))}
        </List>
      </NavbarContainer>
    );
  }
}

export default withTheme(Navbar);
