import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { EntitlementIcon } from 'components/Icons';
import { media } from 'util/helpers/media';
import EntitlementListing from './EntitlementListing';

const DialogContentWidth = styled(DialogContent)`
  width: 50em;
  ${() => media.xs`
    width: auto;
  `};
  ${() => media.sm`
    width: auto;
  `};
`;

const EntitlementModal = ({ title, modal, ...rest }) => (
  <Dialog
    id="entitlement-modal"
    open={modal.open}
    onClose={modal.hideModal}
    onExited={modal.destroyModal}
    aria-labelledby="entitlement-modal"
    maxWidth={false}
  >
    <DialogTitle id="form-dialog-title"><EntitlementIcon /> {title}</DialogTitle>
    <DialogContentWidth>
      <EntitlementListing onClose={modal.hideModal} {...rest} />
    </DialogContentWidth>
  </Dialog>
);

EntitlementModal.propTypes = {
  modal: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default EntitlementModal;
