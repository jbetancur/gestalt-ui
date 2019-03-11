import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/VerifiedUser';

const PolicyIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const PolicyIcon = ({ size, color, ...rest }) => <PolicyIconStyle size={size} color={color} {...rest} />;

PolicyIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

PolicyIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default PolicyIcon;
