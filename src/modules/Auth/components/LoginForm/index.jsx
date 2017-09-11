import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import i18next from 'i18next';
import styled from 'styled-components';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Paper from 'react-md/lib/Papers';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import { APP_TITLE } from '../../../../constants';

const LoginCard = styled(Paper)`
  position: relative;
  background-color: ${props => props.theme.cardBackgroundColor};
  border-radius: 2px;
`;

const LoginCardHeader = styled.div`
  background-color: ${props => props.theme.mainNavBackgroundColor};
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  text-align: center;
  height: 4em;
  line-height: 4em;
  font-size: 1.2em;

  * {
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

const validate = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = i18next.t('auth.fields.username.errorText');
  }

  if (!values.password) {
    errors.password = i18next.t('auth.fields.password.errorText');
  }

  return errors;
};

const LoginForm = (props) => {
  const { login, loginModal, handleSubmit, pristine, invalid, submitting, isAuthenticating, t } = props;
  const submit = (values) => {
    // TODO: disabled for now since we need to refactor routing - but this allows us to redirect to a pasted path
    // const path = (props.router.location.state && props.router.location.state.nextPathname) || '/';
    login(values.username, values.password).then(() => {
      if (loginModal.visible) {
        props.hideLoginModal();
      } else {
        props.history.replace('/');
      }
    });
  };

  return (
    <LoginCard>
      <form onSubmit={handleSubmit(submit)}>
        <LoginCardHeader>
          <span>{APP_TITLE}</span>
        </LoginCardHeader>
        <CardText>
          <Field
            component={TextField}
            name="username"
            type="text"
            placeholder={t('auth.fields.username.label')}
          />
          <Field
            component={TextField}
            name="password"
            type="password"
            placeholder={t('auth.fields.password.label')}
          />
          <LoginError>{props.statusText}</LoginError>
        </CardText>
        {isAuthenticating && <LinearProgress id="login-form" />}
        <CardActions>
          <Row justifyContent="center">
            <Col flex={12}>
              <LoginButton
                flat
                primary
                type="submit"
                label={t('auth.login')}
                disabled={isAuthenticating || pristine || submitting || invalid}
              />
            </Col>
          </Row>
        </CardActions>
      </form>
    </LoginCard>
  );
};

LoginForm.propTypes = {
  // router: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  loginModal: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool,
  statusText: PropTypes.string,
  t: PropTypes.func.isRequired,
};

LoginForm.defaultProps = {
  isAuthenticating: false,
  statusText: '',
};

export default reduxForm({
  form: 'login',
  validate
})(LoginForm);

