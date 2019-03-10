import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '@material-ui/icons/RssFeedOutlined';

const DataFeedIconStyle = styled(Icon)`
  font-size: ${props => `${props.size}px`};
  color: ${props => `${props.color}`};
`;

const DataFeedIcon = ({ size, color, ...rest }) => <DataFeedIconStyle size={size} color={color} {...rest} />;

DataFeedIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

DataFeedIcon.defaultProps = {
  size: 22,
  color: 'action',
};

export default DataFeedIcon;
