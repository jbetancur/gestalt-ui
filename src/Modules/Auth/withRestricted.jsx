import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';
import actions from './actions';

const cookies = new Cookies();
/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export default function AuthWrapper(BaseComponent) {
  class Restricted extends PureComponent {
    static propTypes = {
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      auth: PropTypes.object.isRequired,
    };

    checkAuthentication() {
      const { history, location, auth } = this.props;
      const validCookie = cookies.get('auth_token') || false;

      if (!validCookie) {
        auth.logoutOnTokenExpiration();
        history.replace({
          pathname: '/login',
          state: { nextPathname: location.pathname },
        });
      }

      return validCookie;
    }

    render() {
      return this.checkAuthentication() && <BaseComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    auth: bindActionCreators(actions, dispatch)
  });

  return compose(
    connect(null, mapDispatchToProps),
    withRouter
  )(Restricted);
}
