import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/Security';

const EntitlementIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const EntitlementIcon = ({ size, color, ...rest }) => <EntitlementIconStyle size={size} color={color} {...rest} />;

EntitlementIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

EntitlementIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default EntitlementIcon;
