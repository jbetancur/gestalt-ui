import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';

const Title = styled.div`
  position: absolute;
  margin-left: .5em;
  margin-top: -.1em;
  display: inline-block;
`;


const ModalTitle = props => (
  <div>
    <FontIcon>{props.icon}</FontIcon>
    <Title>{props.title}</Title>
  </div>
);

ModalTitle.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
};

ModalTitle.defaultProps = {
  title: '',
  icon: '',
};

export default ModalTitle;
