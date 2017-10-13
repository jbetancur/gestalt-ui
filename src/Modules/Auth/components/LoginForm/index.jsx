import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import { GestaltIcon } from 'components/Icons';
import { APP_TITLE } from '../../../../constants';

const LoginCard = styled.div`
  position: relative;
  background-color: ${props => props.theme.cardBackgroundColor};
  border-radius: 3px;
`;

const LoginCardText = styled.div`
  padding: 18px;

  input {
    font-size: 16px;
  }
`;

const LoginCardHeader = styled.div`
  background-color: ${props => props.theme.mainNavBackgroundColor};
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  text-align: center;
  height: 6em;
  line-height: 2.2em;
  font-size: 1.2em;
  padding: 1em;

  span {
    display: block;
    font-size: 18px;
    color: ${props => props.theme.fontColorInverse};
    font-family: lovelo, Ubuntu;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
`;

const LoginError = styled.div`
  padding: 1em;
  width: 100%;
  color: ${props => props.theme.errorText};
  text-align:center;
`;

const LoginForm = (props) => {
  const { pristine, invalid, submitting, isAuthenticating } = props;
  const isDisabled = isAuthenticating || pristine || submitting || invalid;

  return (
    <LoginCard>
      <form onSubmit={props.handleSubmit(props.onSubmit)}>
        <LoginCardHeader>
          <GestaltIcon size={42} />
          <span>{APP_TITLE}</span>
        </LoginCardHeader>
        <LoginCardText>
          <Field
            component={TextField}
            name="username"
            type="text"
            placeholder="Username"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <Field
            component={TextField}
            name="password"
            type="password"
            placeholder="Password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <LoginError>{props.statusText}</LoginError>
        </LoginCardText>
        {isAuthenticating && <LinearProgress id="login-form" />}
        <LoginCardText>
          <Row justifyContent="center">
            <Col flex={12}>
              <LoginButton
                flat
                primary
                type="submit"
                disabled={isDisabled}
              >
                Login
              </LoginButton>
            </Col>
          </Row>
        </LoginCardText>
      </form>
    </LoginCard>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool,
  statusText: PropTypes.string,
};

LoginForm.defaultProps = {
  isAuthenticating: false,
  statusText: '',
};

export default LoginForm;
