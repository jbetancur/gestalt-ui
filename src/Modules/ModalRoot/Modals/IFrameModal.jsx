import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import Frame from 'react-frame-component';
import { ActivityContainer } from 'components/ProgressIndicators';

const ResponsiveFrameContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
`;

const ResponsiveFrame = styled(Frame)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

class ActionsModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onComplete: PropTypes.func,
    hideModal: PropTypes.func.isRequired,
    body: PropTypes.string,
    isFullScreen: PropTypes.bool,
  };

  static defaultProps = {
    onComplete: () => { },
    body: null,
    isFullScreen: false,
  };

  componentDidMount() {
    window.addEventListener('message', this.onPostMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onPostMessage);
  }

  onPostMessage = (eventData) => {
    this.props.onComplete({ eventData });
    this.props.modal.hideModal();
  }

  render() {
    const { modal, isFullScreen } = this.props;
    return (
      <Dialog
        id="iframe-modal"
        aria-labelledby="iframe-modal-title"
        aria-describedby="iframe-modal-description"
        open={modal.open}
        onClose={this.close}
        onExited={modal.destroyModal}
        fullScreen={isFullScreen}
      >
        {!this.props.body ?
          <ActivityContainer id="iframe-loading" /> :
          <ResponsiveFrameContainer>
            <ResponsiveFrame
              id="ui-provider-actions-iframe"
              initialContent={this.props.body}
              frameBorder="0"
              mountTarget="#container-root"
              // scrolling="yes"
            />
          </ResponsiveFrameContainer>}

        <button
          id="close-parent-modal"
          type="button"
          style={{ visibility: 'hidden', position: 'absolute' }}
          onClick={this.props.hideModal}
        />
      </Dialog>
    );
  }
}


export default ActionsModal;
