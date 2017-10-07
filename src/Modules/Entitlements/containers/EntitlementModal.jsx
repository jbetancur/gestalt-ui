import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import DialogContainer from 'react-md/lib/Dialogs';
import { ModalTitle } from 'components/Modal';
import EntitlementListing from './EntitlementListing';
import actions from '../actions';

const EnhancedDialog = styled(DialogContainer)`
  .md-dialog {
    width: 50em;
    max-height: 100%;

    .md-dialog-content {
      max-height: 560px;
      overflow: visible;
    }
  }
`;

class EntitlementModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    hideEntitlementsModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleHideModal = () => {
    this.props.hideEntitlementsModal();
  }

  render() {
    return (
      <EnhancedDialog
        id="entitlement-modal"
        autosizeContent={false}
        visible={this.props.modal.visible}
        title={<ModalTitle title={this.props.title} icon="security" />}
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
        <EntitlementListing params={this.props.params} {...this.props} />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps, actions)(withRouter(EntitlementModal));
