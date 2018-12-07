import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { debounce } from 'lodash';
import styled from 'styled-components';
import { ActivityContainer } from 'components/ProgressIndicators';

function getBoundingClientRect(element) {
  try {
    return element.getBoundingClientRect();
  } catch (e) {
    /* check the e is the exception we expect */
    if (typeof e === 'object' && e !== null) {
      return { top: 0, bottom: 0, left: 0, width: 0, height: 0, right: 0 };
    }

    throw e; // something else went wrong, and we must surface the error
  }
}

const ResponsiveFrame = styled.iframe`
  position: relative;
  width: 100%;
  border: 0;
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
    window.addEventListener('resize', debounce(this.handleResize, 150));

    // we need to do this since the iframe is a child of main (due to react routing) that has overflow
    // we will remove the overflow to prevent height weirdness with the iframe and restore in on unmount
    this.iframe.current.parentElement.style.overflow = 'visible';
    this.handleResize();
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
    window.removeEventListener('resize', debounce(this.handleResize, 150));

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

  handleResize = () => {
    const parent = this.iframe.current.parentElement;
    const frame = this.iframe.current;
    // const clientPadding = parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-bottom'), 10) ;
    const parentHeight = parent.clientHeight - (parent.offsetHeight - parent.clientHeight);
    if (Number.isInteger(parentHeight)) {
      frame.height = `${parentHeight - getBoundingClientRect(frame).y}px`;
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
        <ResponsiveFrame
          id={id}
          src={src}
          innerRef={this.iframe}
          onLoad={this.handleOnLoad}
          {...rest}
        />
        {loading && <ActivityContainer id="iframe-loading" />}
      </React.Fragment>
    );
  }
}

export default withRouter(IFrame);
