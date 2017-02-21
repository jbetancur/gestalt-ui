import React from 'react';
import styled from 'styled-components';
import LoginForm from '../LoginForm';
import LoginFooter from '../LoginFooter';

const Wrapper = styled.div`
  padding-bottom: 4em;
  background-color: #58acba;
  height: 100%;
  form {
      height: 100%;
  }
`;

const LoginPage = props => (
  <Wrapper className="flex-row">
    <div className="flex-12 flex-row center-center">
      <div className="flex-4 flex-xs-12 flex-sm-6 flex-md-5 md-paper md-paper--4">
        <LoginForm {...props} />
      </div>
    </div>
    <LoginFooter />
  </Wrapper>
);

export default LoginPage;

