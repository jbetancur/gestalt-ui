import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

/* Huge thanks to @tobiasahlin at http://tobiasahlin.com/spinkit/ */

const animation = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(0.5);
  }
`;

const SpinDiv = styled.div`
  &.spinner > div {
    width: ${props => `${props.size}em`};
    height: ${props => `${props.size}em`};
    background-color: ${props => (props.dropdown && props.theme.activityDotColorDropDown) || props.theme.activityDotColor};
    border-radius: 100%;
    display: inline-block;
    animation: ${animation} 1.4s infinite ease-in-out both;
  }

  &.spinner .bounce1 {
    animation-delay: -0.32s;
  }

  &.spinner .bounce2 {
    animation-delay: -0.16s;
  }
`;

const DotActivity = props =>
  <SpinDiv size={props.size} dropdown={props.dropdown} className="spinner">
    <div className="bounce1" />
    <div className="bounce2" />
    <div className="bounce3" />
  </SpinDiv>;

DotActivity.propTypes = {
  size: PropTypes.string,
  dropdown: PropTypes.bool,
};

DotActivity.defaultProps = {
  size: '.6',
  dropdown: false,
};

export default DotActivity;
