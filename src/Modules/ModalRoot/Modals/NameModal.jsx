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
    nameFormatter: PropTypes.func,
  };

  static defaultProps = {
    title: 'Confirm',
    onProceed: () => {},
    onClose: () => { },
    textLabel: 'Name',
    proceedLabel: 'OK',
    nameFormatter: null,
  };

  state = { name: '' };

  close = () => {
    const { onClose, modal } = this.props;

    modal.hideModal();
    onClose();
  }

  doIt = () => {
    const { onProceed, modal } = this.props;

    const { name } = this.state;
    onProceed({ name });
    modal.hideModal();
  }

  handleNameChange = (name) => {
    const { nameFormatter } = this.props;

    if (nameFormatter && typeof nameFormatter === 'function') {
      this.setState({ name: nameFormatter(name) });
    } else {
      this.setState({ name });
    }
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
        required
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
          <Button raised primary disabled={!name} onClick={this.doIt}>{proceedLabel}</Button>
          <Button flat primary onClick={this.close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NameModal;
