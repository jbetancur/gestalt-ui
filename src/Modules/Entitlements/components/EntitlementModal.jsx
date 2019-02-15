import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { EntitlementIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import EntitlementListing from './EntitlementListing';

const DialogContentStyle = styled(DialogContent)`
  width: 50em;
`;

class EntitlementModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  };

  handleHideModal = () => {
    const { modal } = this.props;

    modal.hideModal();
  }

  render() {
    const { title, modal } = this.props;

    return (
      <Dialog
        id="entitlement-modal"
        open={modal.open}
        onClose={this.handleHideModal}
        onExited={modal.destroyModal}
        aria-labelledby="entitlement-modal"
        maxWidth={false}
      >
        <DialogTitle id="form-dialog-title"><EntitlementIcon /> {title}</DialogTitle>
        <DialogContentStyle>
          <EntitlementListing {...this.props} />
        </DialogContentStyle>
        <DialogActions>
          <Button flat onClick={this.handleHideModal}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EntitlementModal;
