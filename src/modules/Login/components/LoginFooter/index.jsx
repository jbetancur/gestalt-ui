import React from 'react';
import styled from 'styled-components';
import GestaltLogo from '../../../../components/GestaltIcon';

const Wrapper = styled.div`
    background-color: #0b314a;
    position: fixed;
    z-index: 0;
    left: 0;
    bottom: 0;
    height: 4em;
    width: 100%;
    text-align: center;
    line-height: 48px;
    svg {
        height: 42px;
        width: 42px;
    }
`;

const LoginFooter = () => (
  <Wrapper>
    <div className="flex-row center-center">
      <div className="flex-3">
        <GestaltLogo />
      </div>
    </div>
  </Wrapper>
);

export default LoginFooter;
