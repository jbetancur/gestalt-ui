import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'react-md';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';

class NameModal extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func,
    onClose: PropTypes.func,
    textLabel: PropTypes.string,
    proceedLabel: PropTypes.string,
  };

  static defaultProps = {
    title: 'Confirm',
    onProceed: null,
    onClose: null,
    textLabel: 'Name',
    proceedLabel: 'OK',
  };

  state = { name: '' };

  close = () => {
    const { onClose, modal } = this.props;

    modal.hideModal();

    if (onClose) {
      onClose();
    }
  }

  doIt = () => {
    const { onProceed, modal } = this.props;

    const { name } = this.state;
    onProceed({ name });
    modal.hideModal();
  }

  handleNameChange = (name) => {
    this.setState({ name });
  }

  render() {
    const { modal, title, textLabel, proceedLabel } = this.props;
    const { name } = this.state;

    return (
      <Dialog
        id="name-modal"
        aria-labelledby="name-modal-title"
        aria-describedby="name-modal-description"
        open={modal.open}
        onClose={this.close}
        onExited={modal.destroyModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="name-modal-title">{title}</DialogTitle>
        <DialogContent>
          <TextField
            id="name"
            label={textLabel}
            onChange={this.handleNameChange}
            value={name}
            lineDirection="center"
          />
        </DialogContent>
        <DialogActions>
          <Button raised primary onClick={this.doIt}>{proceedLabel}</Button>
          <Button flat primary onClick={this.close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NameModal;
