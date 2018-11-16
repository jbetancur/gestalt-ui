import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled, { withTheme } from 'styled-components';
import { FontIcon, Divider } from 'react-md';
import withApp from 'App/hocs/withApp';
import { GalacticFogIcon } from 'components/Icons';
import NavItem from '../components/NavItem';
import withContext from '../hocs/withContext';
import navItems from '../config/navItems';
import iconMap from '../config/iconMap';
import generateSVG from '../util/generateSVG';

const Logo = styled.div`
  background-color: ${props => props.theme.colors.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.background};
  display: flex;
  flex: 0 0 56px;
  align-items: center;
  justify-content: center;
`;

const NavigationContainer = styled.nav`
  background-color: ${props => props.theme.colors.primary};
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
  white-space: nowrap;
`;

const NavItems = styled.ul`
  position: relative;
  margin: 0;
  padding: 3px 0 0 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

const NavFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid ${props => props.theme.colors.background};
`;

const ExpanderButton = styled.button`
  margin: 0;
  width: 100%;
  outline: none;
  border: none;
  height: 52px;
  cursor: pointer;
  text-align: right;
  padding-right: 22px;
  transition: background-color 195ms ease-in-out;
  background-color: ${props => props.theme.colors.primary};

  &:hover {
    background-color: ${props => props.theme.colors.primaryVariant};
  }

  i {
    color: white;
    transform: rotate(${props => (props.open ? '-180deg' : '0deg')});
    transition-property: transform;
    transition-duration: ${props => (props.open ? '225ms' : '195ms')};
    transition-timing-function: linear;
  }
`;

const ActionDivider = styled(Divider)`
  background: ${props => props.theme.colors.primaryVariant};
`;

class Navigation extends PureComponent {
  static propTypes = {
    context: PropTypes.object.isRequired,
    open: PropTypes.bool,
    width: PropTypes.string,
    miniWidth: PropTypes.string,
    onOpen: PropTypes.func,
    appState: PropTypes.object.isRequired,
  };

  static defaultProps = {
    open: false,
    width: '200px',
    miniWidth: '64px',
    onOpen: null,
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
      context: {
        contextMeta,
        actions,
      },
      context,
      contextPending,
      open,
      width,
      miniWidth,
      appState: { enableExperimental },
      ...rest
    } = this.props;

    const items = contextMeta.context
      ? navItems(context, enableExperimental)[contextMeta.context]
      : [];

    return (
      <NavigationContainer open={open} miniWidth={miniWidth} width={width} {...rest}>
        <Logo>
          <GalacticFogIcon size={36} fill="white" />
        </Logo>
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

          {actions.length > 0 && <ActionDivider />}

          {actions.map(item => (
            <NavItem
              open={open}
              expandedWidth={width}
              miniWidth={miniWidth}
              title={item.display_name || item.action}
              key={item.action}
              icon={item.icon ? generateSVG(item.icon) : <FontIcon>blur_on</FontIcon>}
              to={item.url}
              target={item.render === 'newtab' ? '_blank' : null}
            />
          ))}
        </NavItems>

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
      </NavigationContainer>
    );
  }
}

export default compose(
  withContext(),
  withApp,
  withTheme,
)(Navigation);
