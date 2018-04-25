import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { DialogContainer } from 'react-md';
import Frame from 'react-frame-component';

const iframeStyle = {
  width: '100%',
  height: 'calc(100vh - 300px)',
  boxSizing: 'border-box',
};

const EnhancedDialog = styled(DialogContainer)`
.md-dialog {
  ${props => !props.fullPage && 'position: relative'};
  ${props => !props.fullPage && 'min-width: 45em'};

  @media (min-width: 0) and (max-width: 768px) {
    ${props => !props.fullPage && 'min-width: 25em'};
  }

  .md-dialog-content {
    width: 100%;
    overflow: scroll;
  }
}
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
    body: '',
    isFullScreen: false,
  };

  constructor(props, context) {
    super(props, context);
  }

  onComplete = (eventData) => {
    // console.log('onCompleted', eventData);
    this.props.onComplete({ eventData });
    this.props.hideModal();
  }

  render() {
    return (
      <EnhancedDialog
        id="confirmation-modal"
        visible={this.props.modal.visible}
        modal={false}
        autopadContent={false}
        closeOnEsc
        defaultVisibleTransitionable
        // autosizeContent={false}
        onHide={this.props.hideModal}
        fullPage={this.props.isFullScreen}
        aria-label="external-actions-modal"
      >
        <Frame
          initialContent={this.props.body}
          frameBorder="0"
          mountTarget="#container-root"
          style={iframeStyle}
          scrolling="yes"
        />
        <button
          id="close-parent-modal"
          style={{ visibility: 'hidden', position: 'absolute' }}
          onClick={this.props.hideModal}
        />
        <button
          id="execute-parent-modal"
          style={{ visibility: 'hidden', position: 'absolute' }}
          onClick={this.onComplete}
        />
      </EnhancedDialog>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal
});

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  }
});

export default connect(mapStateToProps, actions)(ActionsModal);
