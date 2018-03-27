import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const GroupIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const GroupIcon = ({ size }) => <GroupIconStyle size={size}>group</GroupIconStyle>;

GroupIcon.propTypes = {
  size: PropTypes.number
};

GroupIcon.defaultProps = {
  size: 24,
};

export default GroupIcon;
