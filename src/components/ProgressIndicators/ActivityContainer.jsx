import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title } from 'components/Typography';
import DotActivity from './DotActivity';

const ActivityWrapper = styled.div`
  position: ${props => (props.fixed ? 'fixed' : 'absolute')};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  text-align: center;
`;

const ActivityContainer = ({ id, visible, primary, fixed, message }) => (
  visible &&
  <ActivityWrapper fixed={fixed}>
    <DotActivity id={id} size={3} centered primary={primary} />
    {message && <Title>Hey</Title>}
  </ActivityWrapper>
);

ActivityContainer.propTypes = {
  id: PropTypes.string.isRequired,
  primary: PropTypes.bool,
  visible: PropTypes.bool,
  fixed: PropTypes.bool,
  message: PropTypes.string,
};

ActivityContainer.defaultProps = {
  primary: false,
  visible: true,
  fixed: true,
  message: null,
};

export default ActivityContainer;
