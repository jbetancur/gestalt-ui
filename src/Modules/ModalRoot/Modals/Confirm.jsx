import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
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

const ConfirmButton = styled(Button)`
  &:not([disabled]) {
    color: ${props => props.theme.colors['$md-red-500']};
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
    this.setState({ force: !this.state.force });
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
    actionButtons.push(<ConfirmButton flat primary onClick={this.doIt} disabled={isConfirmDisabled}>{proceedLabel}</ConfirmButton>);
    actionButtons.push({ primary: true, children: cancelLabel, onClick: this.close });

    const modalTitle = multipleItems.length > 1 ? `${title} (${multipleItems.length})` : title;

    return (
      <EnhancedDialog
        id="confirmation-modal"
        contentStyle={{ maxHeight: '20em' }}
        visible={modal.visible}
        title={(
          <div>
            {modalTitle}
            {forceOption && force && this.renderForceWarning()}
          </div>
        )}
        defaultVisibleTransitionable
        autosizeContent={false}
        onHide={this.close}
        actions={actionButtons}
      >
        <div>
          {body && <p id="confirmation-modal-content" className="md-color--secondary-text">{body}</p>}
          {requireConfirm && <TextField id="confirmation-modal-verify" placeholder={confirmLabel} value={this.state.confirmName} onChange={this.setConfirmName} />}

          <div>
            {multipleItems.length > 0 && <List>{items}</List>}
          </div>
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

export default connect(mapStateToProps, actions)(withTheme(ConfirmModal));
