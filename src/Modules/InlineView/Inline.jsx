import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import base64 from 'base-64';
import Cookies from 'universal-cookie';
import { withRouter } from 'react-router-dom';
import { AutoSizer } from 'react-virtualized';
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

  generateBaseURL() {
    const { location } = window;

    if (location.hostname === 'localhost' || location.hostname === '0.0.0.0') {
      return API_URL;
    }

    // IMPORTANT: url is polyfilled in Root.jsx, mainly for IE 11
    // see: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    return new URL(API_URL, location.origin).href;
  }

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
        baseURL: this.generateBaseURL(),
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
      <AutoSizer>
        {({ width, height }) => (
          <IFrame
            id={`iframe-${params.urlEncoded}`}
            src={src}
            onLoaded={this.handleOnLoaded}
            width={`${width}px`}
            height={`${height - 56}px`} // -56 to optimize for default non-expanded main nav
          />
        )}
      </AutoSizer>
    );
  }
}

export default compose(
  withRouter,
  withRestricted,
  withContext(),
)(InlineView);
