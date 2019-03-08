import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FlatButton } from 'components/Buttons';
import VolumePanelAttach from '../components/VolumePanelAttach';
import VolumePanelCreate from '../components/VolumePanelCreate';
import actions from '../actions';

class VolumeCreateModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    selectedProvider: PropTypes.object.isRequired,
    mode: PropTypes.object.isRequired,
    addVolume: PropTypes.func.isRequired,
    volumes: PropTypes.array.isRequired,
  };

  handleSubmit = (values) => {
    const { modal, addVolume } = this.props;

    addVolume(values);
    modal.hideModal();
  }

  renderForm() {
    const { modal, selectedProvider, mode, volumes, ...rest } = this.props;

    return mode.value === 'attach'
      ? <VolumePanelAttach onSubmit={this.handleSubmit} attachedVolumes={volumes} providerId={selectedProvider.provider.id} {...rest} />
      : <VolumePanelCreate onSubmit={this.handleSubmit} selectedProvider={selectedProvider} {...rest} />;
  }

  render() {
    const { modal, mode } = this.props;

    return (
      <Dialog
        id="volume-form-dialog"
        aria-labelledby="volume-modal-title"
        aria-describedby="volume-modal-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="volume-modal-title">{`${mode.name} Volume`}</DialogTitle>
        <DialogContent>
          {this.renderForm()}
        </DialogContent>
        <DialogActions>
          <FlatButton
            label="Cancel"
            onClick={modal.hideModal}
          />
          <FlatButton
            label="Add Volume"
            color="primary"
            variant="contained"
            onClick={() => document.getElementById('add-container-volume').dispatchEvent(new Event('submit', { cancelable: true }))}
          />
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose(
  connect(null, actions),
)(VolumeCreateModal);
