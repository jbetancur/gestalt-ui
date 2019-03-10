import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/LineStyle';

const StreamIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const StreamIcon = ({ size, color, ...rest }) => <StreamIconStyle size={size} color={color} {...rest} />;

StreamIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

StreamIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default StreamIcon;
