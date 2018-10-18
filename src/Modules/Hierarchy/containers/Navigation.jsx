import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';
import withApp from 'App/hocs/withApp';
import NavItem from '../components/NavItem';
import withContext from '../hocs/withContext';
import navItems from '../config/navItems';
import iconMap from '../config/iconMap';

// const ContextTitle = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;

//   div {
//     color: ${props => props.theme.colors['$md-grey-600']};
//     line-height: 0;
//     overflow-x: hidden;
//     white-space: nowrap;
//     height: 22px;
//     width: 100px;
//     display: flex;
//     align-items: center;
//   }

//   i,
//   svg {
//     display: inline-block;
//     line-height: 0;
//     margin: 13px 18px;
//   }

//   i {
//     color: ${props => props.theme.colors['$md-grey-500']};
//   }

//   svg {
//     fill: ${props => props.theme.colors['$md-grey-500']};
//   }
// `;

const NavbarContainer = styled.nav`
  background-color: transparent;
  position: relative;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  z-index: 11;
  height: 100%;
  width: ${({ open, width, miniWidth }) => (open ? width : miniWidth)};
  transition-property: width;
  transition-duration: ${props => (props.open ? '225ms' : '195ms')};
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-delay: 0ms;
  will-change: transform;
  border-right: 1px solid ${props => props.theme.colors['$md-grey-200']};
  white-space: nowrap;
`;

// const NavbarHeader = styled.header`
//   min-height: 56px;
//   box-sizing: content-box;
//   border-bottom: 1px solid ${props => props.theme.colors['$md-grey-200']};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

const NavItems = styled.ul`
  background-color: white;
  margin: 0;
  padding: 4px 0 0 0;
  width: 100%;
  height: 100%;
`;

const NavFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid ${props => props.theme.colors['$md-grey-200']};
`;

const ExpanderButton = styled.button`
  margin: 0;
  width: 100%;
  outline: none;
  border: none;
  height: 52px;
  background-color: white;
  cursor: pointer;
  text-align: right;
  padding-right: 22px;
  transition: background-color 195ms ease-in-out;

  &:hover {
    background-color: ${props => props.theme.colors['$md-grey-200']};
  }

  i {
    color: ${props => props.theme.colors['$md-grey-600']};
    transform: rotate(${props => (props.open ? '-180deg' : '0deg')});
    transition-property: transform;
    transition-duration: ${props => (props.open ? '225ms' : '195ms')};
    transition-timing-function: linear;
  }
`;

class Navbar extends PureComponent {
  static propTypes = {
    context: PropTypes.object.isRequired,
    open: PropTypes.bool,
    width: PropTypes.string,
    miniWidth: PropTypes.string,
    onOpen: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    appState: PropTypes.object.isRequired,
  };

  static defaultProps = {
    open: false,
    width: '200px',
    miniWidth: '64px',
    onOpen: () => { },
    children: null,
  };

  handleOpen = (e) => {
    const { onOpen } = this.props;

    if (onOpen) {
      onOpen(e);
    }
  }

  getContextType() {
    const {
      context: { contextMeta },
    } = this.props;

    return contextMeta.context
      ? contextMeta.context.charAt(0).toUpperCase() + contextMeta.context.slice(1)
      : null;
  }

  render() {
    const {
      context: { contextMeta },
      context,
      contextPending,
      open,
      width,
      miniWidth,
      appState: { enableExperimental },
      children,
      ...rest
    } = this.props;

    const items = contextMeta.context
      ? navItems(context, enableExperimental)[contextMeta.context]
      : [];

    return (
      <NavbarContainer open={open} miniWidth={miniWidth} width={width} {...rest}>
        {/* <NavbarHeader>
          <ContextTitle>
            {iconMap(contextMeta.context, 28)}
            <div>{this.getContextType()}</div>
          </ContextTitle>
        </NavbarHeader> */}
        <NavItems>
          {items.map(item => (
            <NavItem
              open={open}
              expandedWidth={width}
              miniWidth={miniWidth}
              title={item.title}
              key={item.key}
              icon={iconMap(item.icon)}
              to={item.to}
              isVisible={item.isVisible}
              activeClassName="active-link"
            />
          ))}

          {children}
          <NavFooter>
            <ExpanderButton
              onClick={this.handleOpen}
              open={open}
            >
              <FontIcon>
                chevron_right
              </FontIcon>
            </ExpanderButton>
          </NavFooter>
        </NavItems>
      </NavbarContainer>
    );
  }
}

export default compose(
  withContext(),
  withApp,
  withTheme,
)(Navbar);
