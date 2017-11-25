import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PStyle = styled.p`
  display: block;
  line-height: 16px;
  padding-bottom: 1em;
  color: ${props => props.theme.fontColorLight};
  font-size: ${props => `${props.fontSize}px`};
  ${props => props.overflow && `overflow: ${props.overflow}`};
  ${props => props.maxHeight && `max-height: ${props.maxHeight}`};
  ${props => props.wrap && 'word-wrap: break-word'};
`;

const P = props => (
  <PStyle
    fontSize={props.fontSize}
    overflow={props.overflow}
    maxHeight={props.maxHeight}
    wrap={props.wrap}
  >
    {props.children}
  </PStyle>
);

P.propTypes = {
  fontSize: PropTypes.number,
  overflow: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  wrap: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

P.defaultProps = {
  children: null,
  fontSize: 14,
  overflow: false,
  maxHeight: false,
  wrap: false,
};

export default P;
