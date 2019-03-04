import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import styled from 'styled-components';
import { TextField, PasswordTextField } from 'components/Form';
import { DotActivity } from 'components/ProgressIndicators';
import LoginStyle from './LoginStyle';
import LoginButton from './LoginButton';

const Username = styled(TextField)`
  ${LoginStyle};
`;

const Password = styled(PasswordTextField)`
  ${LoginStyle};
`;

const Section = styled.div`
  width: 100%;
  z-index: 1;
  padding: 10px;

  input {
    font-size: 16px;
  }
`;

const LoginForm = ({ submitting, handleSubmit, pending }) => (
  <form onSubmit={handleSubmit}>
    <Section>
      <Field
        id="login--username"
        component={Username}
        name="username"
        placeholder="Username"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        margin="normal"
        variant="filled"
        disableError
      />
      <Field
        id="login--password"
        component={Password}
        name="password"
        placeholder="Password"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        margin="normal"
        variant="filled"
        disableError
      />
    </Section>

    <Section>
      <LoginButton
        id="login--submit"
        raised
        primary
        type="submit"
        disabled={pending || submitting}
      >
        {pending ? <DotActivity id="login-form" primary centered size={1.2} /> : 'Login'}
      </LoginButton>
    </Section>
  </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pending: PropTypes.bool,
};

LoginForm.defaultProps = {
  pending: false,
};

export default LoginForm;
