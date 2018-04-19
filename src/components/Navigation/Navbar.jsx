import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: white;
  ${props => (props.vertical && 'bottom: 0')};
  width: ${props => (props.vertical ? '72px' : '100%')};
  border-right: 1px solid ${props => props.theme.colors['$md-grey-200']};
  padding-left: 0;
  display: flex;
  flex-direction: ${props => (props.vertical ? 'column' : 'row')};
  justify-content: start;
  align-items: start;
  padding-top: 16px;
  height: 100%;
  overflow: visible;
  z-index: 5;
  top: 4.3em;
`;

const List = styled.div`
  list-style-type: none;
  margin: 0;
  padding: 0;
  align-self: center;
`;

class Navbar extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    items: [],
    vertical: false,
  };

  render() {
    const { items, vertical } = this.props;

    return (
      <NavbarContainer vertical={vertical}>
        <List>
          {items.map((item, i) => (
            <div key={i}>
              {item}
            </div>
          ))}
        </List>
      </NavbarContainer>
    );
  }
}

export default withTheme(Navbar);
