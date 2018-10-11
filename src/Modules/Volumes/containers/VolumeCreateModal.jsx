import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { DialogContainer } from 'react-md';
import { Button } from 'components/Buttons';
import VolumePanelAttach from '../components/VolumePanelAttach';
import VolumePanelCreate from '../components/VolumePanelCreate';
import actions from '../actions';

class VolumeCreateModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    hideModal: PropTypes.func.isRequired,
    addVolume: PropTypes.func.isRequired
  };

  handleSubmit = (values) => {
    const { addVolume, hideModal } = this.props;

    addVolume(values);
    hideModal();
  }

  renderForm() {
    const { modal, hideModal, ...rest } = this.props;
    const { modalProps } = modal;

    return modal.modalProps.mode.value === 'attach'
      ? <VolumePanelAttach onSubmit={this.handleSubmit} attachedVolumes={modalProps.volumes} providerId={modalProps.selectedProvider.provider.id} {...rest} />
      : <VolumePanelCreate onSubmit={this.handleSubmit} selectedProvider={modalProps.selectedProvider} {...rest} />;
  }

  render() {
    const { modal, hideModal } = this.props;
    const modalActions = [
      <Button
        key="add-container-volume--cancel"
        flat
        onClick={hideModal}
      >
        Cancel
      </Button>,
      <Button
        key="add-container-volume--submit"
        raised
        primary
        onClick={() => document.getElementById('add-container-volume').dispatchEvent(new Event('submit', { cancelable: true }))}
      >
        Add Volume
      </Button>
    ];

    return (
      <DialogContainer
        id="context-form-dialog"
        title={`${modal.modalProps.mode.name} Volume`}
        visible={modal.visible}
        onHide={hideModal}
        width="60em"
        defaultVisibleTransitionable
        modal
        initialFocus="div"
        actions={modalActions}
      >
        {this.renderForm()}
      </DialogContainer>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal,
});

export default compose(
  connect(mapStateToProps, actions),
)(VolumeCreateModal);
