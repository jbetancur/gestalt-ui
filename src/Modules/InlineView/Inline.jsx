import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import base64 from 'base-64';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router-dom';
import IFrame from 'components/IFrame';
import { withRestricted } from 'Modules/Authentication';
import withContext from '../Hierarchy/hocs/withContext';
import { API_URL, API_TIMEOUT } from '../../constants';

const cookies = new Cookies();

class InlineView extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  };

  handleOnLoaded = (iframe) => {
    const { hierarchyContext: { context }, history, authActions } = this.props;
    const token = cookies.get('auth_token');
    const validToken = !!token;

    if (!validToken) {
      // fall back for missing token & Eat any 401 errors
      authActions.logout(true);
      history.replace('/login');
    } else {
      iframe.postMessage({
        baseURL: API_URL,
        timeout: API_TIMEOUT,
        token,
        ...context,
      }, '*');
    }
  }

  render() {
    const { match: { params } } = this.props;
    // base64 decode the url
    const src = base64.decode(params.urlEncoded);

    return (
      <IFrame
        id={`iframe-${params.urlEncoded}`}
        src={src}
        onLoaded={this.handleOnLoaded}
      />
    );
  }
}

export default compose(
  withRouter,
  withRestricted,
  withContext(),
)(InlineView);
