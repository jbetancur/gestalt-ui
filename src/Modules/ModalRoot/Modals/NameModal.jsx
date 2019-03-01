import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from 'components/Fields/TextField';
import SelectField from 'components/Fields/SelectField';
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
    defaultName: PropTypes.string,
    textLabel: PropTypes.string,
    proceedLabel: PropTypes.string,
    nameFormatter: PropTypes.func,
    showTargetDropdown: PropTypes.bool,
    targetDropdownValues: PropTypes.array,
    targetDropdownLabel: PropTypes.string,
    defaultTargetValue: PropTypes.string,
  };

  static defaultProps = {
    title: 'Confirm',
    onProceed: () => {},
    onClose: () => { },
    defaultName: '',
    textLabel: 'Name',
    proceedLabel: 'OK',
    nameFormatter: null,
    showTargetDropdown: false,
    targetDropdownValues: [],
    targetDropdownLabel: 'Targets',
    defaultTargetValue: '',
  };

  state = {
    name: this.props.defaultName,
    selectedTargetValue: this.props.defaultTargetValue,
  };

  close = () => {
    const { onClose, modal } = this.props;

    modal.hideModal();
    onClose();
  }

  doIt = () => {
    const { onProceed, modal } = this.props;

    const { name, selectedTargetValue } = this.state;
    onProceed({ name, selectedTargetValue });
    modal.hideModal();
  }

  handleNameChange = ({ target }) => {
    const { nameFormatter } = this.props;

    if (nameFormatter && typeof nameFormatter === 'function') {
      this.setState({ name: nameFormatter(target.value) });
    } else {
      this.setState({ name: target.value });
    }
  }

  handleTargetChange = (selectedTargetValue) => {
    this.setState({ selectedTargetValue });
  }

  render() {
    const { modal, title, textLabel, proceedLabel, showTargetDropdown, targetDropdownValues, targetDropdownLabel } = this.props;
    const { name, selectedTargetValue } = this.state;
    const showTargets = showTargetDropdown && targetDropdownValues.length > 0;
    const disableSubmit = showTargetDropdown
      ? !name || !selectedTargetValue
      : !name;

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
            required
            fullWidth
          />
          {showTargets && (
            <SelectField
              id="name-modal-targets"
              label={targetDropdownLabel}
              menuItems={targetDropdownValues}
              itemLabel="name"
              itemValue="id"
              value={selectedTargetValue}
              onChange={this.handleTargetChange}
              required
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button raised primary disabled={disableSubmit} onClick={this.doIt}>{proceedLabel}</Button>
          <Button flat primary onClick={this.close}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NameModal;
