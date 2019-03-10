import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Group';

const GroupIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const GroupIcon = ({ size, color, ...rest }) => <GroupIconStyle size={size} color={color} {...rest} />;

GroupIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

GroupIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default GroupIcon;
