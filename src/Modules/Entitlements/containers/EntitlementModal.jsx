import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { EntitlementIcon } from 'components/Icons';
import { Button } from 'components/Buttons';
import EntitlementListing from './EntitlementListing';
import actions from '../actions';

const DialogContentStyle = styled(DialogContent)`
  width: 50em;
`;

class EntitlementModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    hideEntitlementsModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  handleHideModal = () => {
    const { hideEntitlementsModal } = this.props;

    hideEntitlementsModal();
  }

  render() {
    const { visible, title } = this.props;

    return (
      <Dialog
        id="entitlement-modal"
        open={visible}
        onClose={this.handleHideModal}
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

export default compose(
  connect(null, actions)
)(EntitlementModal);
