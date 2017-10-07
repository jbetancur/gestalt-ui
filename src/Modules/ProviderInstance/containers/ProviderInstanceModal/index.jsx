import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';
import { Button } from 'components/Buttons';
import ProviderActionsWizard from '../../components/Wizard';
import actions from '../../actions';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    padding-top: 5em;

    .md-dialog-content {

    }
  // }
`;

class ProvidererInstanceModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
    hideProviderInstanceModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const nav = <Button icon iconChildren="close" onClick={() => this.props.hideProviderInstanceModal()} />;
    const action = <Button flat onClick={() => this.props.hideProviderInstanceModal()}>Close</Button>;

    return (
      <EnhancedDialog
        id="entitlement-modal"
        fullPage
        visible={this.props.modal.visible}
        modal={false}
        closeOnEsc
        defaultVisibleTransitionable
        onHide={() => this.props.hideProviderInstanceModal()}
      >
        <Toolbar
          colored
          nav={nav}
          actions={action}
          title="Create a Provider Instance"
          fixed
        />
        <ProviderActionsWizard {...this.props} />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps, actions)(ProvidererInstanceModal);
