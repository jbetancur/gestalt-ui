import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { DialogContainer, List, ListItem, TextField, Checkbox } from 'react-md';
import { Button } from 'components/Buttons';
import { Error } from 'components/Typography';

const ForceSection = styled.div`
  display: inline-block;
  position: absolute;
  left: 0;
`;

const ListRow = styled.div`
  max-height: 12em;
  overflow: scroll;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
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
      ?
      `All associated resources of "${values.name}" will be deleted. This action CANNOT be undone!`
      :
      'All associated resources will be deleted. This action CANNOT be undone!';

    return (
      <Error large bold block style={{ padding: '16px' }}>
        {message}
      </Error>
    );
  }

  render() {
    const { force } = this.state;
    const { visible, title, body, forceOption, requireConfirm, values, multipleItems, proceedLabel, cancelLabel } = this.props;
    const isConfirmDisabled = requireConfirm && this.state.disable;
    const confirmLabel = `Type in the name of the ${values.type} to confirm`;
    const items = multipleItems.map((item, i) => (
      <ListItem key={i} inkDisabled primaryText={item} />
    ));

    const actionButtons = [];
    if (forceOption) {
      actionButtons.push(
        <ForceSection>
          <Checkbox
            id="confirmation-modal--force-delete"
            name="confirmation-modal--force-delete"
            label="Force Delete"
            inline
            onChange={this.handleForceChecked}
            value={force}
          />
        </ForceSection>
      );
    }

    actionButtons.push(<Button flat important onClick={this.doIt} disabled={isConfirmDisabled}>{proceedLabel}</Button>);
    actionButtons.push(<Button flat primary onClick={this.close}>{cancelLabel}</Button>);

    const modalTitle = multipleItems.length > 1 ? `${title} (${multipleItems.length})` : title;

    return (
      <DialogContainer
        id="confirmation-modal"
        width="30em"
        contentStyle={{ maxHeight: '25em' }}
        visible={visible}
        title={modalTitle}
        defaultVisibleTransitionable
        onHide={this.close}
        actions={actionButtons}
      >
        <div>
          {forceOption && force && this.renderForceWarning()}
          {body && <p id="confirmation-modal-content" className="md-color--secondary-text">{body}</p>}
          {requireConfirm && <TextField id="confirmation-modal-verify" placeholder={confirmLabel} value={this.state.confirmName} onChange={this.setConfirmName} />}
          {multipleItems.length > 0 &&
          <ListRow>
            <List>{items}</List>
          </ListRow>}
        </div>
      </DialogContainer>
    );
  }
}

const actions = dispatch => ({
  hideModal: () => {
    dispatch({ type: 'HIDE_MODAL' });
  }
});

export default connect(null, actions)(ConfirmModal);
