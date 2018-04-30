import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const Footer = styled.footer`
  position: fixed;
  background-color: ${props => props.theme.colors['$md-white']};
  bottom: 0;
  right: 0;
  min-height: 56px;
  width: calc(100% - 72px);
  padding: 8px 24px 8px 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-top: 1px solid ${props => props.theme.colors['$md-grey-200']};
  z-index: 19;

  button,
  a {
    margin-left: 0.1em;
    margin-right: 0.1em;
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

const FullPageFooter = ({ leftActions, rightActions, children }) => (
  <Footer>
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
  ]).isRequired,
};

FullPageFooter.defaultProps = {
  leftActions: null,
  rightActions: null,
};

export default withTheme(FullPageFooter);
