import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DotActivity from './DotActivity';

const ActivityWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

const ActivityContainer = props => (
  props.visible &&
  <ActivityWrapper>
    <DotActivity id={props.id} size={3} centered primary={props.primary} />
  </ActivityWrapper>
);

ActivityContainer.propTypes = {
  id: PropTypes.string.isRequired,
  primary: PropTypes.bool,
  visible: PropTypes.bool,
};

ActivityContainer.defaultProps = {
  primary: false,
  visible: true,
};

export default ActivityContainer;
