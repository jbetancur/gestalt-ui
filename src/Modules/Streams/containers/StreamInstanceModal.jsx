import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { Button } from 'components/Buttons';
import StreamInstance from '../components/StreamInstance';

class StreamInstanceModal extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    hideModal: PropTypes.func.isRequired,
    fqon: PropTypes.string.isRequired,
    streamId: PropTypes.string.isRequired,
    persistenceId: PropTypes.string.isRequired,
  };


  render() {
    const { fqon, streamId, persistenceId } = this.props;

    return (
      <DialogContainer
        id="context-form-dialog"
        title="View Stream"
        visible={this.props.modal.visible}
        onHide={this.props.hideModal}
        actions={<Button flat primary onClick={this.props.hideModal}>Close</Button>}
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

const mapStateToProps = state => ({
  modal: state.modal,
});


export default connect(mapStateToProps, actions)(StreamInstanceModal);
