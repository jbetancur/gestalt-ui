import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import actions from '../../actions';
import LoginPage from '../../components/LoginPage';

function mapStateToProps(state) {
  return {
    token: state.login.login.token,
    isAuthenticating: state.login.login.isAuthenticating,
    statusText: state.login.login.statusText,
    loginModal: state.login.loginModal,
  };
}

export default connect(mapStateToProps, actions)(translate()(LoginPage));
