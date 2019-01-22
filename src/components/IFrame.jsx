import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
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
  };

  static defaultProps = {
    onReceived: null,
    onLoaded: null,
  };

  constructor(props) {
    super(props);

    this.iframe = React.createRef();

    this.state = {
      height: '100%',
      loading: true,
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.onPostMessage);

    // we need to do this since the iframe is a child of main (due to react routing) that has overflow
    // we will remove the overflow to prevent height weirdness with the iframe and restore in on unmount

    this.iframe.current.parentElement.style.overflow = 'visible';
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

    // restore parent(main)
    this.iframe.current.parentElement.style.overflow = 'auto';
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
      <React.Fragment>
        <AutoSizer>
          {({ width, height }) => (
            <ResponsiveFrame
              id={id}
              src={src}
              ref={this.iframe}
              onLoad={this.handleOnLoad}
              width={`${width}px`}
              height={`${height}px`}
              {...rest}
            />
          )}
        </AutoSizer>
        {loading && <ActivityContainer id="iframe-loading" />}
      </React.Fragment>
    );
  }
}

export default withRouter(IFrame);
