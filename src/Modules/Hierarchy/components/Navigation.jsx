import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import base64 from 'base-64';
import styled from 'styled-components';
import BlurIcon from '@material-ui/icons/BlurOn';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from 'components/Divider';
import { PersistentDrawer } from 'components/NavigationDrawers';
import { GalacticFogIcon } from 'components/Icons';
import NavItem from './NavItem';
import { AppConsumer } from '../../../App/AppContext';
import withContext from '../hocs/withContext';
import navItems from '../config/navItems';
import iconMap from '../config/iconMap';
import generateSVG from '../util/generateSVG';

const Logo = styled.div`
  background-color: ${props => props.theme.colors.primary};
  border-bottom: 1px solid ${props => props.theme.colors.background};
  display: flex;
  flex: 0 0 56px;
  align-items: center;
  justify-content: center;
`;

const NavItems = styled.ul`
  position: relative;
  margin: 0;
  padding: 3px 0 0 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
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
  color: white;

  &:hover {
    background-color: ${props => props.theme.colors.primaryVariant};
  }

  svg {
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
    hierarchyContext: PropTypes.object.isRequired,
    open: PropTypes.bool,
    width: PropTypes.string,
    miniWidth: PropTypes.string,
    onOpen: PropTypes.func,
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

  generateTarget(item) {
    switch (item.render) {
      case 'newtab':
        return '_blank';
      default:
        return '_self';
    }
  }

  generateInlineLink(item) {
    const { hierarchyContext } = this.props;
    const { context: { contextMeta } } = hierarchyContext;

    const url = base64.encode(item.url);

    switch (contextMeta.context) {
      case 'workspace':
        return `/${contextMeta.fqon}/hierarchy/${contextMeta.workspaceId}/inline/${url}`;
      case 'environment':
        return `/${contextMeta.fqon}/hierarchy/${contextMeta.workspaceId}/environment/${contextMeta.environmentId}/inline/${url}`;
      default:
        return `/${contextMeta.fqon}/inline/${url}`;
    }
  }

  generateLink(item) {
    switch (item.render) {
      case 'newtab':
        return item.url;
      default:
        return this.generateInlineLink(item);
    }
  }

  render() {
    const {
      hierarchyContext,
      open,
      width,
      miniWidth,
    } = this.props;

    const {
      context: {
        contextMeta,
        actions,
      },
      context,
    } = hierarchyContext;

    return (
      <PersistentDrawer open={open} miniWidth={miniWidth} width={width}>
        <Logo>
          <GalacticFogIcon size={36} fill="white" />
        </Logo>
        <AppConsumer>
          {({ enableExperimental }) => {
            const items = contextMeta.context
              ? navItems(context, enableExperimental)[contextMeta.context]
              : [];

            return (
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

                {actions.map((item, index) => (
                  <NavItem
                    open={open}
                    expandedWidth={width}
                    miniWidth={miniWidth}
                    title={item.display_name || item.action}
                    key={`${item.action}-${index}`}
                    icon={item.icon ? generateSVG(item.icon) : <BlurIcon color="inherit" />}
                    to={this.generateLink(item)}
                    target={this.generateTarget(item)}
                  />
                ))}
              </NavItems>
            );
          }}
        </AppConsumer>
        <NavFooter>
          <ExpanderButton
            onClick={this.handleOpen}
            open={open}
          >
            <ChevronRightIcon />
          </ExpanderButton>
        </NavFooter>
      </PersistentDrawer>
    );
  }
}

export default withContext()(Navigation);
