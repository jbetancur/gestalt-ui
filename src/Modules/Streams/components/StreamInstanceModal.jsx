import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FlatButton } from 'components/Buttons';
import StreamInstance from './StreamInstance';

class StreamInstanceModal extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    streamId: PropTypes.string.isRequired,
    persistenceId: PropTypes.string.isRequired,
  };

  render() {
    const { modal, fqon, streamId, persistenceId } = this.props;

    return (
      <Dialog
        id="streaminstance-modal"
        aria-labelledby="streaminstance-modal-title"
        aria-describedby="streaminstance-modal-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="streaminstance-modal-title">View Stream Metrics</DialogTitle>
        <DialogContent>
          <StreamInstance fqon={fqon} streamId={streamId} persistenceId={persistenceId} />
        </DialogContent>
        <DialogActions>
          <FlatButton label="Close" color="primary" onClick={modal.hideModal} />
        </DialogActions>
      </Dialog>
    );
  }
}

export default StreamInstanceModal;
