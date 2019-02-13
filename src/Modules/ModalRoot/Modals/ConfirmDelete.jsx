import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TextField, Checkbox } from 'react-md';
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
    visible: PropTypes.bool.isRequired,
    onProceed: PropTypes.func,
    hideModal: PropTypes.func.isRequired,
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

  setConfirmName = (confirmName) => {
    this.setState({ confirmName }, () => {
      if (this.state.confirmName === this.props.values.name) {
        this.setState({ disable: false });
      } else {
        this.setState({ disable: true });
      }
    });
  }

  close = () => {
    const { onClose, hideModal } = this.props;

    hideModal();

    if (onClose) {
      onClose();
    }
  }

  doIt = () => {
    const { onProceed, hideModal } = this.props;

    const { force } = this.state;
    onProceed({ force });
    hideModal();
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
        raised
        message={{ message, icon: true, status: 'error' }}
      />
    );
  }

  render() {
    const { force, disable, confirmName } = this.state;
    const { visible, title, body, forceOption, requireConfirm, values, multipleItems, proceedLabel, cancelLabel } = this.props;
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
        open={visible}
        onClose={this.close}
        maxWidth="xs"
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
                placeholder={confirmLabel}
                value={confirmName}
                onChange={this.setConfirmName}
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
          <Checkbox
            id="confirmation-modal--force-delete"
            name="confirmation-modal--force-delete"
            label="Force Delete"
            inline
            onChange={this.handleForceChecked}
            value={force}
            style={{ width: '100%' }}
          />
          <Button raised important onClick={this.doIt} disabled={isConfirmDisabled}>{proceedLabel}</Button>
          <Button flat primary onClick={this.close}>{cancelLabel}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  }
});

export default connect(null, actions)(ConfirmModal);
