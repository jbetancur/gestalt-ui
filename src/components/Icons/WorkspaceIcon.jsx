import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Widgets';

const WorkspaceIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px !important`};
  color: ${props => `${props.color}`};
`;

const WorkspaceIcon = ({ size, color, ...rest }) => <WorkspaceIconStyle size={size} color={color} {...rest} />;

WorkspaceIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

WorkspaceIcon.defaultProps = {
  size: 24,
  color: 'action',
};

export default WorkspaceIcon;
