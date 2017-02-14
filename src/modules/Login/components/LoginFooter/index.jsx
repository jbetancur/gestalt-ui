import React from 'react';
import styled from 'styled-components';
import GestaltIcon from 'components/GestaltIcon';

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
    .logo {
        margin-left: 2.2em;
    }
`;

const LoginFooter = () => (
  <Wrapper>
    <div className="flex-row center-center logo-container">
      <div className="flex-row center-center flex-12">
        <div className="logo"><GestaltIcon /></div>
      </div>
    </div>
  </Wrapper>
);

export default LoginFooter;
