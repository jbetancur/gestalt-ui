import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
/**
 * Higher-order component (HOC) to wrap restricted pages
 */
export default function AuthWrapper(BaseComponent) {
  class Restricted extends PureComponent {
    static propTypes = {
      history: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
    };

    checkAuthentication() {
      const { history, location } = this.props;
      const validCookie = !!cookies.get('auth_token') || false;

      if (!validCookie) {
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

  return withRouter(Restricted);
}
