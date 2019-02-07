import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

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
  white-space: nowrap;
  width: ${props => props.width};
  ${baseAnime};
  ${props => (props.direction === 'left' ? leftTransform : rightTransform)};
`;

const FloatingDrawer = memo(({ open, width, direction, children }) => (
  <Aside open={open} direction={direction} width={width}>
    {children}
  </Aside>
));

FloatingDrawer.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.string,
  open: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

FloatingDrawer.defaultProps = {
  direction: 'left',
  width: '250px',
  open: false,
};

export default FloatingDrawer;
