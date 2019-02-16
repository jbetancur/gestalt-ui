import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';
import { media } from 'util/helpers/media';
import StreamInstance from './StreamInstance';

const DialogContentCustom = styled(DialogContent)`
  width: 800px;
  ${() => media.xs`
    width: auto;
  `};
  ${() => media.sm`
    width: auto;
  `};
`;

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
      >
        <DialogTitle id="streaminstance-modal-title">View Stream Metrics</DialogTitle>
        <DialogContentCustom>
          <StreamInstance fqon={fqon} streamId={streamId} persistenceId={persistenceId} />
        </DialogContentCustom>
        <DialogActions>
          <Button flat primary onClick={modal.hideModal}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default StreamInstanceModal;
