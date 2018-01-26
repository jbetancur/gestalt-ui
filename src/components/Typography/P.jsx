import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PStyle = styled.p`
  display: block;
  line-height: 16px;
  padding-bottom: 1em;
  color: ${props => props.theme.fontColorLight};
  font-size: ${props => `${props.fontSize}px`};
`;

const P = ({ fontSize, children }) => (
  <PStyle fontSize={fontSize}>
    {children}
  </PStyle>
);

P.propTypes = {
  fontSize: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

P.defaultProps = {
  children: null,
  fontSize: 14,
};

export default P;
