import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled, { withTheme } from 'styled-components';
import { FontIcon } from 'react-md';
import {
  HierarchyIcon,
  MetamodelIcon,
  ProviderIcon,
  UserIcon,
  GroupIcon,
  EnvironmentIcon,
  LambdaIcon,
  ContainerIcon,
  APIIcon,
  PolicyIcon,
  SecretIcon,
  StreamIcon,
  DataFeedIcon,
  VolumeIcon,
  MainframeIcon,
} from 'components/Icons';
import withApp from 'App/withApp';
import NavItem from '../components/NavItem';
import withContext from '../hocs/withContext';
import navItems from '../config/navItems';

const iconMap = {
  hierarchy: <HierarchyIcon size={24} />,
  provider: <ProviderIcon size={24} />,
  user: <UserIcon size={24} />,
  group: <GroupIcon size={24} />,
  resourceType: <MetamodelIcon size={24} />,
  environment: <EnvironmentIcon size={24} />,
  container: <ContainerIcon size={24} />,
  lambda: <LambdaIcon size={24} />,
  api: <APIIcon size={24} />,
  policy: <PolicyIcon size={24} />,
  volume: <VolumeIcon size={24} />,
  secret: <SecretIcon size={24} />,
  stream: <StreamIcon size={24} />,
  datafeed: <DataFeedIcon size={24} />,
  cloudframe: <MainframeIcon size={24} />,
};

const NavbarContainer = styled.div`
  position: relative;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: visible;
  z-index: 11;
  height: 100%;
  width: ${({ open, width }) => (open ? width : '64px')};
  transition-property: width;
  transition-duration: ${props => (props.open ? '225ms' : '195ms')};
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-delay: 0ms;
  will-change: transform;
  border-right: 1px solid ${props => props.theme.colors['$md-grey-200']};
  white-space: nowrap;
`;

const NavItems = styled.ul`
  margin: 0;
  padding: 3px 0 0 0;
  width: 100%;
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

  &:hover {
    background-color: ${props => props.theme.colors['$md-grey-200']};
  }

  i {
    color: ${props => props.theme.colors['$md-grey-600']};
    transform: rotate(${props => (props.open ? '-90deg' : '90deg')});
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
    onOpen: () => {},
    children: null,
  };

  handleOpen = (e) => {
    const { onOpen } = this.props;

    if (onOpen) {
      onOpen(e);
    }
  }

  render() {
    const {
      context: { contextMeta },
      context,
      open,
      width,
      appState: { enableExperimental },
      children,
      ...rest
    } = this.props;

    const items = contextMeta.context ? navItems(context, enableExperimental)[contextMeta.context] : [];

    return (
      <NavbarContainer open={open} width={width} {...rest}>
        <NavItems>
          {items.map(item => (
            <NavItem
              width={width}
              title={item.title}
              key={item.key}
              icon={iconMap[item.icon]}
              to={item.to}
              isVisible={item.isVisible}
              activeClassName="active-link"
            >
              {item}
            </NavItem>
          ))}

          {children}
          <NavFooter>
            <ExpanderButton
              onClick={this.handleOpen}
              open={open}
            >
              <FontIcon>
                keyboard_capslock
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
