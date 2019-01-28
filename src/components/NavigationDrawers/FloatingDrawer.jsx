import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Button } from 'components/Buttons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { EnvironmentIcon, LambdaIcon, ContainerIcon } from 'components/Icons';

const leftTransform = css`
  transform: translateX(${({ open, width }) => (open ? 0 : `-${width}`)});
  left: 0;
`;

const rightTransform = css`
  transform: translateX(${({ open, width }) => (open ? 0 : width)});
  right: 0;
`;

const baseAnime = css`
  transition: 225ms transform;
  transition-duration: ${({ open }) => (open ? '225ms' : '195ms')};
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-delay: 0;
  will-change: transform;
`;

const Aside = styled.aside`
  position: fixed;
  top: 0;
  bottom: 0;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  z-index: 1000;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
  background-color: ${props => props.theme.colors.background};
  border-left: 1px solid ${props => props.theme.colors.divider};
  white-space: nowrap;
  width: ${props => props.width};
  ${baseAnime};
  ${props => (props.direction === 'left' ? leftTransform : rightTransform)};
`;

const Subheader = styled.header`
  display: flex;
  align-items: center;
  flex-direction: ${props => (props.direction === 'left' ? 'row-reverse' : 'row')};
  height: 56px;
  padding: 6px;
  border-bottom: 1px solid ${props => props.theme.colors.dividerVariant};

  button {
    ${props => (props.direction === 'left' ? 'margin-right: 8px' : 'margin-left: 8px')};
  }

  span {
    width: 100%;
    text-align: ${props => (props.direction === 'left' ? 'center' : 'left')};
    padding-left: 24px;
    padding-right: 24px;
    color: ${props => props.theme.colors.font};
    font-size: 14px;
    font-weight: 500;
    user-select: none;
  }
`;

const FloatingDrawer = memo(({ title, open, onClose, width, direction, children }) => (
  <Aside open={open} direction={direction} width={width}>
    <List subheader={(
      <Subheader direction={direction}>
        <Button icon onClick={onClose}>close</Button>
        <span>{title}</span>
      </Subheader>
      )}
    >
      <ListItem button divider onClick={onClose}>
        <Avatar>
          <EnvironmentIcon />
        </Avatar>
        <ListItemText primary="JB's Environment" secondary="Such wow" />
      </ListItem>
      <ListItem button divider>
        <Avatar>
          <EnvironmentIcon />
        </Avatar>
        <ListItemText primary="Sy's Dungeon" secondary="Puts the lotion in the basket..." />
      </ListItem>
      <ListItem button>
        <Avatar>
          <LambdaIcon />
        </Avatar>
        <ListItemText primary="Hello Lambda" secondary="some descriptions" />
      </ListItem>
      <ListItem button>
        <Avatar>
          <ContainerIcon />
        </Avatar>
        <ListItemText primary="Hello Container" secondary="some descriptions" />
      </ListItem>
    </List>
    {children}
  </Aside>
));

FloatingDrawer.propTypes = {
  title: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

FloatingDrawer.defaultProps = {
  direction: 'left',
  width: '250px',
  open: false,
  onClose: null,
};

export default FloatingDrawer;
