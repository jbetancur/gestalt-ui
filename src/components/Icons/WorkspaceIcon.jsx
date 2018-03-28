import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';

const WorkspaceIconStyle = styled(FontIcon)`
  font-size: ${props => `${props.size}px !important`};
`;

const WorkspaceIcon = ({ size }) => <WorkspaceIconStyle size={size}>work</WorkspaceIconStyle>;

WorkspaceIcon.propTypes = {
  size: PropTypes.number
};

WorkspaceIcon.defaultProps = {
  size: 24,
};

export default WorkspaceIcon;
