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

const EnhancedDialog = styled(DialogContainer)`
  .md-dialog {
    width: 100%;
    max-width: 28em;
    word-wrap: break-word;
  }

  .md-dialog-footer--inline {
    position: relative;
    align-items: center;
  }
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
    modal: PropTypes.object.isRequired,
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

  constructor(props) {
    super(props);

    this.state = { confirmName: '', disable: true, force: false, };
  }

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
    this.props.hideModal();
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  doIt = () => {
    const { force } = this.state;
    this.props.onProceed({ force });
    this.props.hideModal();
  }

  handleForceChecked = () => {
    this.setState(prevState => ({ force: !prevState.force }));
  }

  renderForceWarning() {
    return (
      <center>
        <Error bold block>
          Associated child resources will be Deleted!!!
        </Error>
      </center>
    );
  }

  render() {
    const { force } = this.state;
    const { title, body, modal, forceOption, requireConfirm, values, multipleItems, proceedLabel, cancelLabel } = this.props;
    const isConfirmDisabled = requireConfirm && this.state.disable;
    const confirmLabel = `Please type in the name of the ${values.type} to confirm`;
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
      <EnhancedDialog
        id="confirmation-modal"
        contentStyle={{ maxHeight: '25em' }}
        visible={modal.visible}
        title={(
          <React.Fragment>
            {modalTitle}
            {forceOption && force && this.renderForceWarning()}
          </React.Fragment>
        )}
        defaultVisibleTransitionable
        onHide={this.close}
        actions={actionButtons}
      >
        <div>
          {body && <p id="confirmation-modal-content" className="md-color--secondary-text">{body}</p>}
          {requireConfirm && <TextField id="confirmation-modal-verify" placeholder={confirmLabel} value={this.state.confirmName} onChange={this.setConfirmName} />}
          {multipleItems.length > 0 &&
          <ListRow>
            <List>{items}</List>
          </ListRow>}
        </div>
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

export default connect(mapStateToProps, actions)(ConfirmModal);
