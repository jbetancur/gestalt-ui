import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import Frame from 'react-frame-component';

const EnhancedDialog = styled(Dialog)`
.md-dialog {
  width: 100%;
  max-width: 45em;

  .md-dialog-content {
    height: 18em;
    overflow: visible;
  }
}
`;

class ActionsModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    body: PropTypes.string,
    proceedLabel: PropTypes.string,
  };

  static defaultProps = {
    onProceed: () => { },
    title: '',
    body: '',
    proceedLabel: 'Close',
  };

  constructor(props) {
    super(props);
  }

  doIt() {
    this.props.onProceed();
    this.props.hideModal();
  }

  render() {
    return (
      <EnhancedDialog
        id="confirmation-modal"
        visible={this.props.modal.visible}
        modal={false}
        title={this.props.title}
        closeOnEsc
        defaultVisibleTransitionable
        onHide={() => this.props.hideModal()}
        actions={[{
          onClick: () => this.doIt(),
          primary: true,
          label: this.props.proceedLabel,
        }]}
      >
        <Frame
          initialContent={this.props.body}
          frameBorder="0"
          mountTarget="#container-root"
          style={{ width: '100%', height: '100%' }}
        />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal
  };
}

function actions(dispatch) {
  return {
    hideModal: () => {
      dispatch({ type: 'HIDE_MODAL' });
    }
  };
}

export default connect(mapStateToProps, actions)(ActionsModal);
