import { connect } from 'react-redux';
import * as actions from './actions';
import LoginForm from './components/LoginForm';

function mapStateToProps(state) {
  return {
    token: state.login.token,
    isAuthenticating: state.login.isAuthenticating,
    statusText: state.login.statusText
  };
}

export default connect(mapStateToProps, actions)(LoginForm);
