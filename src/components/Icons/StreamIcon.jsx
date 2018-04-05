import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const StreamIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const StreamIcon = ({ size }) => <StreamIconStyle size={size}>line_style</StreamIconStyle>;

StreamIcon.propTypes = {
  size: PropTypes.number
};

StreamIcon.defaultProps = {
  size: 24,
};

export default StreamIcon;
