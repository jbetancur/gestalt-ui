import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import { ModalTitle } from 'components/Modal';
import EntitlementListing from '../EntitlementListing';
import * as actions from '../../actions';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 60em;
    max-height: 100%;

    .md-dialog-content {
      height: 445px;
      overflow: scroll;
    }
  }
`;

class EntitlementModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
    hideEntitlementsModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <EnhancedDialog
        id="entitlement-modal"
        position="below"
        visible={this.props.modal.visible}
        title={<ModalTitle title={<span>{this.props.title}</span>} icon="security" />}
        modal={false}
        closeOnEsc
        defaultVisibleTransitionable
        onHide={() => this.props.hideEntitlementsModal()}
        actions={[
          {
            onClick: () => this.props.hideEntitlementsModal(),
            primary: true,
            label: 'Close',
          }]}
      >
        <EntitlementListing {...this.props} />
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
