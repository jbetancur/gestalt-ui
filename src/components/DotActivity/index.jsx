import React from 'react';
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
    width: 10px;
    height: 10px;
    background-color: ${props => props.theme.colors['$md-grey-500']};
    border-radius: 100%;
    display: inline-block;
    animation: ${animation} 1.4s infinite ease-in-out both;
  }

  &.spinner .bounce1 {
    animation-delay: -0.32s;
  }

  &.spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
`;

const DotActivity = () =>
  <SpinDiv className="spinner">
    <div classNamw="bounce1" />
    <div className="bounce2" />
    <div className="bounce3" />
  </SpinDiv>;

export default DotActivity;
