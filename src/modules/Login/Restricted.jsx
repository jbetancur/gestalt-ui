import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import cookie from 'react-cookie';

/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export default function AuthWrapper(BaseComponent) {
  class Restricted extends PureComponent {
    checkAuthentication(params) {
      const { history } = params;
      const validCookie = !!cookie.load('auth_token') || false;

      if (!validCookie) {
        history.replace({
          pathname: '/login',
          // state: { nextPathname: nextState.location.pathname }
        });
      }

      return validCookie;
    }

    render() {
      return this.checkAuthentication(this.props) && <BaseComponent {...this.props} />;
    }
  }

  return withRouter(Restricted);
}
