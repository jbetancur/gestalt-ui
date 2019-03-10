import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  right: 0;
  min-height: 53px;
  width: 100%;
  width: ${props => (props.fullWidth ? '100%' : 'calc(100% - 56px)')};
  background-color: ${props => props.theme.colors.background.default};
  border-top: 1px solid ${props => props.theme.colors.background.defaultBorder};
  padding: 8px 24px 8px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  z-index: 10;

  button,
  a {
    margin-left: 3px;
  }
`;

const Left = styled.div`
  flex: 1 0 auto;
  display: flex;
`;

const Right = styled.div`
  flex: 1 0 auto;
  display: flex;
  justify-content: flex-end;
`;

const FullPageFooter = ({ leftActions, rightActions, fullWidth, children }) => (
  <Footer fullWidth={fullWidth}>
    <Left>
      {leftActions}
    </Left>

    <Right>
      {rightActions}
      {children}
    </Right>
  </Footer>
);

FullPageFooter.propTypes = {
  leftActions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  rightActions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  fullWidth: PropTypes.bool,
};

FullPageFooter.defaultProps = {
  leftActions: null,
  rightActions: null,
  fullWidth: false,
  children: null,
};

export default FullPageFooter;
