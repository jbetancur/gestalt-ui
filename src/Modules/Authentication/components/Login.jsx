import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { Container, Col, Row } from 'react-flexybox';
import { Form } from 'react-final-form';
import { GalacticFogIcon } from 'components/Icons';
import { getItem } from 'util/helpers/localstorage';
import actions from '../actions';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';
import lightTheme from '../../../themes/light';
import { APP_TITLE } from '../../../constants';

const validate = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = ' ';
  }

  if (!values.password) {
    errors.password = ' ';
  }

  return errors;
};

const Wrapper = styled(Container)`
  position: relative;
  padding-bottom: 72px;
  background: radial-gradient(circle, ${props => props.theme.colors['$russian-black-50']} 0, ${props => props.theme.colors['$russian-black-300']} 100%);
  height: 100%;
`;

const LoginCardHeader = styled.div`
  color: white;
  text-align: center;
  line-height: 42px;

  span {
    display: block;
    font-size: 18px;
    font-family: lovelo, Ubuntu;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
`;

const Error = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1em;
  background: ${props => props.theme.colors.error};
  color: white;
  text-align: center;
  font-weight: 700;
`;

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    statusText: PropTypes.string,
  };

  static defaultProps = {
    statusText: null,
  };

  submitLogin = (values) => {
    const { history, login, location } = this.props;
    /*
    location is used when pasting in an address into he address bar
    if last lastVisitedRoute location object is present in localstorage then that path will be redirected upon logon
    */
    const path = (location.state && location.state.nextPathname) || JSON.parse(getItem('lastVisitedRoute')) || '/';
    const onSuccess = () => history.replace(path);

    login(values.username, values.password, onSuccess);
  };

  render() {
    return (
      <ThemeProvider theme={lightTheme}>
        <Wrapper fluid>
          {this.props.statusText && <Error>{this.props.statusText}</Error>}
          <Row center fill>
            <Col flex={3} xs={12} sm={8} md={5}>
              <Card>

                <LoginCardHeader>
                  <GalacticFogIcon size={56} fill="white" />
                  <span>{APP_TITLE}</span>
                </LoginCardHeader>
                <Form
                  onSubmit={this.submitLogin}
                  validate={validate}
                  render={LoginForm}
                  pending={this.props.isAuthenticating}
                />
              </Card>
            </Col>
          </Row>
          <LoginFooter />
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  token: state.login.login.token,
  isAuthenticating: state.login.login.isAuthenticating,
  statusText: state.login.login.statusText,
});

export default connect(mapStateToProps, actions)(LoginContainer);
