import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { ActivityContainer } from 'components/ProgressIndicators';

const ResponsiveFrame = styled.iframe`
  position: relative;
  border: 0;
  width: ${props => props.width};
  height: ${props => props.height};
`;

class IFrame extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    onReceived: PropTypes.func,
    match: PropTypes.object.isRequired,
    onLoaded: PropTypes.func,
    width: PropTypes.string,
    height: PropTypes.string,
  };

  static defaultProps = {
    onReceived: null,
    onLoaded: null,
    width: '100%',
    height: '100%',
  };

  iframe = React.createRef();

  state = {
    height: '100%',
    loading: true,
  };

  componentDidMount() {
    window.addEventListener('message', this.onPostMessage);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { match: { params }, width, height } = this.props;
    const { loading } = this.state;

    if (nextProps.match.params.urlEncoded !== params.urlEncoded) {
      return true;
    }

    if (nextState.loading !== loading) {
      return true;
    }

    if (nextState.width !== width) {
      return true;
    }

    if (nextState.height !== height) {
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
    const { id, src, onLoaded, width, height, ...rest } = this.props;
    const { loading } = this.state;

    return (
      <React.Fragment>
        <ResponsiveFrame
          id={id}
          src={src}
          ref={this.iframe}
          onLoad={this.handleOnLoad}
          onLoaded={onLoaded}
          width={width}
          height={height}
          {...rest}
        />
        {loading && <ActivityContainer id="iframe-loading" />}
      </React.Fragment>
    );
  }
}

export default withRouter(IFrame);
