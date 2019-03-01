import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from 'components/Fields/TextField';
import Checkbox from 'components/Fields/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';
import Alert from 'components/Alert';

const DialogContentScroller = styled(DialogContent)`
  padding: 24px 0 24px 0 !important;
  max-height: 400px !important;
`;

class ConfirmModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func,
    title: PropTypes.string.isRequired,
    requireConfirm: PropTypes.bool,
    multipleItems: PropTypes.array,
    body: PropTypes.string,
    values: PropTypes.object,
    proceedLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    onClose: PropTypes.func,
    forceOption: PropTypes.bool,
  };

  static defaultProps = {
    onProceed: null,
    multipleItems: [],
    body: '',
    values: {},
    requireConfirm: false,
    proceedLabel: 'Delete',
    cancelLabel: 'Cancel',
    onClose: null,
    forceOption: true,
  };

  state = { confirmName: '', disable: true, force: false, };

  setConfirmName = ({ target }) => {
    this.setState({ confirmName: target.value }, () => {
      if (this.state.confirmName === this.props.values.name) {
        this.setState({ disable: false });
      } else {
        this.setState({ disable: true });
      }
    });
  }

  close = () => {
    const { onClose, modal } = this.props;

    modal.hideModal();

    if (onClose) {
      onClose();
    }
  }

  doIt = () => {
    const { onProceed, modal } = this.props;

    const { force } = this.state;
    onProceed({ force });
    modal.hideModal();
  }

  handleForceChecked = () => {
    this.setState(prevState => ({ force: !prevState.force }));
  }

  renderForceWarning() {
    const { values } = this.props;
    const message = values.name
      ? `All associated child resources of "${values.name}" will be deleted. This action CANNOT be undone!`
      : 'All associated child resources will be deleted. This action CANNOT be undone!';

    return (
      <Alert
        width="auto"
        message={{ message, icon: true, status: 'error' }}
      />
    );
  }

  render() {
    const { force, disable, confirmName } = this.state;
    const { modal, title, body, forceOption, requireConfirm, values, multipleItems, proceedLabel, cancelLabel } = this.props;
    const modalTitle = multipleItems.length > 1
      ? `${title} (${multipleItems.length})`
      : title;
    const isConfirmDisabled = requireConfirm && disable;
    const confirmLabel = `Type in the name of the ${values.type} to confirm`;

    return (
      <Dialog
        id="confirmation-modal"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        open={modal.open}
        onClose={this.close}
        onExited={modal.destroyModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="confirmation-modal-title">{modalTitle}</DialogTitle>

        {forceOption && force && this.renderForceWarning()}

        {(body || requireConfirm) && (
        <DialogContent>
          {body && <DialogContentText>{body}</DialogContentText>}
          {requireConfirm && (
            <DialogContentText>
              <TextField
                id="confirmation-modal-verify"
                label={confirmLabel}
                value={confirmName}
                onChange={this.setConfirmName}
                fullWidth
              />
            </DialogContentText>
          )}
        </DialogContent>
        )}

        {multipleItems.length > 0 && (
          <DialogContentScroller>
            {multipleItems.map((item, i) => (
              <ListItem key={i}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </DialogContentScroller>
        )}

        <DialogActions>
          {forceOption &&
            <Checkbox
              id="confirmation-modal--force-delete"
              name="confirmation-modal--force-delete"
              label="Force Delete"
              onChange={this.handleForceChecked}
              checked={force}
              fullWidth
            />}
          <Button raised primary onClick={this.doIt} disabled={isConfirmDisabled}>{proceedLabel}</Button>
          <Button flat primary onClick={this.close}>{cancelLabel}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmModal;
