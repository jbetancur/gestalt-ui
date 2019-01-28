import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const baseAnime = css`
  transition-property: width;
  transition-duration: ${({ open }) => (open ? '225ms' : '195ms')};
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-delay: 0ms;
  will-change: transition;
`;

const PersistentDrawerStyle = styled.nav`
  background-color: ${({ theme }) => theme.colors.primary};
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  z-index: 11;
  height: 100%;
  width: ${({ open, width, miniWidth }) => (open ? width : miniWidth)};
  white-space: nowrap;
  ${baseAnime};
`;

const PersistentDrawer = memo(({ children, miniWidth, width, open }) => (
  <PersistentDrawerStyle
    miniWidth={miniWidth}
    width={width}
    open={open}
  >
    {children}
  </PersistentDrawerStyle>
));

PersistentDrawer.propTypes = {
  open: PropTypes.bool,
  width: PropTypes.string,
  miniWidth: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

PersistentDrawer.defaultProps = {
  open: false,
  width: '200px',
  miniWidth: '64px',
  children: null,
};

export default PersistentDrawer;
