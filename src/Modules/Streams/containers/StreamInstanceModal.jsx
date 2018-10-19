import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { Button } from 'components/Buttons';
import StreamInstance from '../components/StreamInstance';

class StreamInstanceModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    fqon: PropTypes.string.isRequired,
    streamId: PropTypes.string.isRequired,
    persistenceId: PropTypes.string.isRequired,
  };


  render() {
    const { visible, hideModal, fqon, streamId, persistenceId } = this.props;

    return (
      <DialogContainer
        id="context-form-dialog"
        title="View Stream"
        visible={visible}
        onHide={hideModal}
        actions={<Button flat primary onClick={hideModal}>Close</Button>}
        defaultVisibleTransitionable
        initialFocus="div"
        autopadContent={false}
        width="40em"
      >
        <StreamInstance fqon={fqon} streamId={streamId} persistenceId={persistenceId} />
      </DialogContainer>
    );
  }
}

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  },
});


export default connect(null, actions)(StreamInstanceModal);
