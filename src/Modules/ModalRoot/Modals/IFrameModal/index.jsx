import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import Frame from 'react-frame-component';

const iframeStyle = {
  width: '100%',
  height: 'calc(100vh - 300px)',
  boxSizing: 'border-box',
};

const EnhancedDialog = styled(Dialog)`
.md-dialog {
  ${props => !props.fullPage && 'position: relative'};
  ${props => !props.fullPage && 'min-width: 45em'};

  @media (min-width: 0) and (max-width: 768px) {
    ${props => !props.fullPage && 'min-width: 25em'};
  }

  .md-dialog-content {
    width: 100%;
    overflow: scroll;
    padding: 0;
  }
}
`;

class ActionsModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func,
    hideModal: PropTypes.func.isRequired,
    body: PropTypes.string,
    isFullScreen: PropTypes.bool,
  };

  static defaultProps = {
    onProceed: () => { },
    body: '',
    isFullScreen: false,
  };

  constructor(props) {
    super(props);
  }

  doIt() {
    this.props.onProceed();
    this.props.hideModal();
  }

  render() {
    return (
      <EnhancedDialog
        id="confirmation-modal"
        visible={this.props.modal.visible}
        modal={false}
        closeOnEsc
        defaultVisibleTransitionable
        autosizeContent={false}
        onHide={() => this.props.hideModal()}
        fullPage={this.props.isFullScreen}
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
          onClick={() => this.props.hideModal()}
        />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal
  };
}

function actions(dispatch) {
  return {
    hideModal: () => {
      dispatch({ type: 'HIDE_MODAL' });
    }
  };
}

export default connect(mapStateToProps, actions)(ActionsModal);
