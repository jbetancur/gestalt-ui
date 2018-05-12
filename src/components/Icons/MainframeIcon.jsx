import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const MainframeIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const GroupIcon = ({ size }) => <MainframeIconStyle size={size}>storage</MainframeIconStyle>;

GroupIcon.propTypes = {
  size: PropTypes.number
};

GroupIcon.defaultProps = {
  size: 24,
};

export default GroupIcon;
