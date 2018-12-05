import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class IFrame extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    onReceived: PropTypes.func,
    match: PropTypes.object.isRequired,
    onLoaded: PropTypes.func,
  };

  static defaultProps = {
    onReceived: null,
    onLoaded: null,
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
    window.parent.postMessage('ready', '*');
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

  onPostMessage = (event) => {
    const { onLoaded, onReceived } = this.props;

    // use the ready message data to let gestalt ui that the iframe has loaded the dom, scripts and css
    if (onLoaded && event.data === 'ready') {
      onLoaded(this.iframe.current.contentWindow);
    }

    if (onReceived) {
      onReceived(event);
    }
  }

  handleOnLoad = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    const { id, src, ...rest } = this.props;
    const { loading } = this.state;

    return (
      <ResponsiveFrameContainer>
        <ResponsiveFrame
          id={id}
          src={src}
          innerRef={this.iframe}
          onLoad={this.handleOnLoad}
          {...rest}
        />
        {loading && <ActivityContainer id="iframe-loading" />}
      </ResponsiveFrameContainer>
    );
  }
}

export default withRouter(IFrame);
