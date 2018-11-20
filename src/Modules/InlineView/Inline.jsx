import React, { Component } from 'react';
import PropTypes from 'prop-types';
import base64 from 'base-64';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { ActivityContainer } from 'components/ProgressIndicators';

const ResponsiveFrameContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
`;

const ResponsiveFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border: 0;
  -webkit-overflow-scrolling: touch;
`;

class InlineView extends Component {
  static propTypes = {
    onReceived: PropTypes.func,
    match: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onReceived: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.iframe = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('message', this.onPostMessage);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { match: { params } } = this.props;
    const { loading } = this.state;

    if (nextProps.match.params.urlEncoded !== params.urlEncoded) {
      return true;
    }

    if (nextState.loading !== loading) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onPostMessage);
  }

  onPostMessage = (eventData) => {
    const { onReceived } = this.props;

    if (onReceived) {
      onReceived({ eventData });
    }
  }

  setLoaded = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    const { match: { params } } = this.props;
    const { loading } = this.state;
    const src = base64.decode(params.urlEncoded);

    return (
      <ResponsiveFrameContainer>
        <ResponsiveFrame
          id="ui-provider-actions-iframe"
          src={src}
          innerRef={this.iframe}
          onLoad={this.setLoaded}
        />
        {loading && <ActivityContainer id="iframe-loading" />}
      </ResponsiveFrameContainer>
    );
  }
}

export default withRouter(InlineView);
