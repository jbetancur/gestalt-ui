import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { ModalTitle } from 'components/Modal';
import { EntitlementIcon } from 'components/Icons';
import EntitlementListing from './EntitlementListing';
import actions from '../actions';

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
      <DialogContainer
        id="entitlement-modal"
        autosizeContent={false}
        width="50em"
        visible={visible}
        title={<ModalTitle title={title} icon={<EntitlementIcon />} />}
        defaultVisibleTransitionable
        closeOnEsc
        onHide={this.handleHideModal}
        actions={[
          {
            onClick: this.handleHideModal,
            primary: true,
            label: 'Close',
          }]}
      >
        <EntitlementListing {...this.props} />
      </DialogContainer>
    );
  }
}

export default compose(
  connect(null, actions)
)(EntitlementModal);
