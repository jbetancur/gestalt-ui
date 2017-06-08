import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const EnhancedP = styled.p`
  color: ${props => props.theme.fontColorLight}
  padding-bottom: 1em;
  line-height: 1.05;
  font-size: ${props => `${props.fontSize}px`};
  display: block;
`;

const P = props => <EnhancedP fontSize={props.fontSize}>{props.children}</EnhancedP>;

P.propTypes = {
  children: PropTypes.node,
  fontSize: PropTypes.number,
};

P.defaultProps = {
  children: [],
  fontSize: 12,
};

export default P;
