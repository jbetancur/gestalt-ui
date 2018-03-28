import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Title = styled.div`
  position: absolute;
  margin-left: 0.5em;
  margin-top: -0.1em;
  display: inline-block;
`;

const ModalTitle = props => (
  <div>
    {props.icon}
    <Title>{props.title}</Title>
  </div>
);

ModalTitle.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.object,
};

ModalTitle.defaultProps = {
  title: null,
  icon: null,
};

export default ModalTitle;
