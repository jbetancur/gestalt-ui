import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import styled, { withTheme, keyframes } from 'styled-components';
import { DotActivity } from 'components/ProgressIndicators';
import { Button } from 'components/Buttons';
import { TextField } from 'components/ReduxFormFields';
import { GestaltIcon } from 'components/Icons';
import { APP_TITLE } from '../../../constants';

const autofill = keyframes`
  to {
    background: transparent;
    color: inherit;
  }
`;

const TextFieldStyle = styled(TextField)`
  * {
    color: white;
  }

  input {
    background: rgba(0, 0, 0, 0) !important;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    padding: 2px;

    &::placeholder {
      color: white;
    }
  }

  .md-divider--text-field::after {
    background: white;
  }

  .md-divider:not(.md-divider--text-field-error) {
    background: white;
  }

  .md-password-btn {
    height: 32px;
    width: 32px;
  }

  /* Hack for chrome & safari autofill ugliness */
  input:-webkit-autofill,
  input:-webkit-autofill:active,
  input:-webkit-autofill:focus,
  input.md-text-field:-webkit-autofill,
  input.md-text-field:-webkit-autofill:active,
  input.md-text-field:-webkit-autofill:focus {
    box-shadow: none;
    transition: background-color 10000s ease-in-out 0s;
    -webkit-animation-name: ${autofill};
    -webkit-animation-fill-mode: both;
    -webkit-text-fill-color: white;
    caret-color: white;
  }
`;

const LoginCardText = styled.div`
  padding: 18px;

  input {
    font-size: 16px;
  }
`;

const LoginCardHeader = styled.div`
  color: white;
  text-align: center;
  line-height: 42px;

  span {
    display: block;
    font-size: 20px;
    font-family: lovelo, Ubuntu;
  }
`;

const LoginButton = styled(Button)`
  background: white;
  color: ${props => props.theme.colors['$md-blue-400']};
  width: 100%;
  box-shadow: none;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors['$md-blue-grey-50']};
  }

  &:disabled {
    background: ${props => props.theme.colors['$md-blue-grey-50']};
  }
`;

const Error = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1em;
  background: ${props => props.theme.colors['$md-red-500']};
  color: white;
  text-align: center;
  font-weight: 700;
`;

const LoginForm = ({ submitting, handleSubmit, onSubmit, isAuthenticating, statusText }) => {
  const isDisabled = isAuthenticating || submitting;

  return (
    <div>
      {statusText && <Error>{statusText}</Error>}
      <LoginCardHeader>
        <GestaltIcon size={52} />
        <span>{APP_TITLE}</span>
      </LoginCardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LoginCardText>
          <Field
            id="login--username"
            component={TextFieldStyle}
            name="username"
            type="text"
            placeholder="Username"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <Field
            id="login--password"
            component={TextFieldStyle}
            name="password"
            type="password"
            placeholder="Password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </LoginCardText>

        <LoginCardText>
          <Row justifyContent="center">
            <Col flex={12}>
              <LoginButton
                id="login--submit"
                raised
                primary
                type="submit"
                disabled={isDisabled}
              >
                {isAuthenticating ? <DotActivity id="login-form" primary centered size={1.2} /> : 'Login'}
              </LoginButton>
            </Col>
          </Row>
        </LoginCardText>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool,
  statusText: PropTypes.string,
};

LoginForm.defaultProps = {
  isAuthenticating: false,
  statusText: '',
};

export default withTheme(LoginForm);
