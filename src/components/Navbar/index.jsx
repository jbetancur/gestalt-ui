import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const NavbarContainer = styled.nav`
  position: absolute;
  left: 0;
  background-color: white;
  ${props => (props.vertical && 'bottom: 0')};
  width: ${props => (props.vertical ? '68px' : '100%')};
  // ${props => props.vertical && 'height: calc(100vh - 7.3em)'};
  border-right: 1px solid ${props => props.theme.colors['$md-grey-200']};
  padding-left: 0;
  display: flex;
  flex-direction: ${props => (props.vertical ? 'column' : 'row')};
  justify-content: start;
  align-items: start;
  padding-top: 16px;
  z-index: 14;
  top: 4em;

  @media (min-width: 0) and (max-width: 768px) {
    top: 3em;
  }
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  align-self: center;
`;

const ListItem = styled.li`
  color: inherit;
  display: inline-block;
  height: 67px;
  width: 67px;
  font-size: 12px;
  cursor: pointer;
  align-self: center;
  text-align: center;
  line-height: 40px;

  * {
    padding: 0;
    // vertical-align: middle;
  }
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
