import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 4.6em;
  left: 0;
  bottom: 0;
  background-color: white;
  ${props => (props.vertical && 'bottom: 0')};
  width: ${props => (props.vertical ? '72px' : '100%')};
  border-right: 1px solid ${props => props.theme.colors['$md-grey-300']};
  padding-left: 0;
  display: flex;
  flex-direction: ${props => (props.vertical ? 'column' : 'row')};
  justify-content: start;
  align-items: start;
  padding-top: 16px;
  z-index: 14;
  height: 100%;
  overflow: visible;

  @media (min-width: 0) and (max-width: 768px) {
    top: 3.8em;
  }
`;

const List = styled.div`
  list-style-type: none;
  margin: 0;
  padding: 0;
  align-self: center;
`;

const ListItem = styled.div`
  color: inherit;
  display: inline-block;
  width: 100%;
  font-size: 12px;
  cursor: pointer;
  align-self: center;
  text-align: center;
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

  constructor() {
    super();

    this.state = { selectedIndex: 0 };
  }

  setSelected(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    const { items, vertical } = this.props;

    return (
      <NavbarContainer vertical={vertical}>
        <List>
          {items.map((item, i) => (
            <ListItem
              key={i}
              onClick={() => this.setSelected(i)}
            >
              {item}
            </ListItem>
          ))}
        </List>
      </NavbarContainer>
    );
  }
}

export default withTheme(Navbar);
