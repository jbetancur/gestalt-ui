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
    selectedProvider: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    addVolume: PropTypes.func.isRequired,
    volumes: PropTypes.array.isRequired,
  };

  handleSubmit = (values) => {
    const { addVolume, hideModal } = this.props;

    addVolume(values);
    hideModal();
  }

  renderForm() {
    const { hideModal, selectedProvider, mode, volumes, ...rest } = this.props;

    return mode.value === 'attach'
      ? <VolumePanelAttach onSubmit={this.handleSubmit} attachedVolumes={volumes} providerId={selectedProvider.provider.id} {...rest} />
      : <VolumePanelCreate onSubmit={this.handleSubmit} selectedProvider={selectedProvider} {...rest} />;
  }

  render() {
    const { visible, mode, hideModal } = this.props;
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
        id="volume-form-dialog"
        title={`${mode.name} Volume`}
        visible={visible}
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

export default compose(
  connect(null, actions),
)(VolumeCreateModal);
