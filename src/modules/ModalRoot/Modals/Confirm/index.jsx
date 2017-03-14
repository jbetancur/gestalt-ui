import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Dialog from 'react-md/lib/Dialogs';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    width: 100%;
    max-width: 26em;
  }
`;

class ConfirmModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    multipleItems: PropTypes.array,
    body: PropTypes.string,
    proceedLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
  };

  static defaultProps = {
    onProceed: () => {},
    multipleItems: [],
    body: '',
    proceedLabel: 'Delete',
    cancelLabel: 'Cancel',
  };

  constructor(props) {
    super(props);
  }

  doIt() {
    this.props.onProceed();
    this.props.hideModal();
  }

  render() {
    const items = this.props.multipleItems.map((item, i) => (
      <ListItem key={i} inkDisabled primaryText={item} />
      ));

    return (
      <EnhancedDialog
        id="confirmation-modal"
        contentStyle={{ maxHeight: '10em' }}
        visible={this.props.modal.visible}
        title={this.props.title}
        modal={false}
        closeOnEsc
        onHide={() => this.props.hideModal()}
        actions={[{
          onClick: () => this.doIt(),
          style: { color: 'red' },
          label: this.props.proceedLabel,
        },
        {
          onClick: () => this.props.hideModal(),
          primary: true,
          label: this.props.cancelLabel,
        }]}
      >
        <div>
          {this.props.body ? <p id="confirmation-modal-content" className="md-color--secondary-text">{this.props.body}</p> : null}
          {this.props.multipleItems.length ? <List>{items}</List> : null}
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
