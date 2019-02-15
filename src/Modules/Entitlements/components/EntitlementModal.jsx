import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { EntitlementIcon } from 'components/Icons';
import EntitlementListing from './EntitlementListing';

const EntitlementModal = ({ title, modal, ...rest }) => (
  <Dialog
    id="entitlement-modal"
    open={modal.open}
    onClose={modal.hideModal}
    onExited={modal.destroyModal}
    aria-labelledby="entitlement-modal"
    maxWidth="md"
  >
    <DialogTitle id="form-dialog-title"><EntitlementIcon /> {title}</DialogTitle>
    <DialogContent>
      <EntitlementListing onClose={modal.hideModal} {...rest} />
    </DialogContent>
  </Dialog>
);

EntitlementModal.propTypes = {
  modal: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default EntitlementModal;
