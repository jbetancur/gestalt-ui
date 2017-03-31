import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Dialog from 'react-md/lib/Dialogs';
import TextField from 'react-md/lib/TextFields';
import * as actions from '../../actions';

class ConfirmModal extends PureComponent {
  static propTypes = {
    actionsModal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    numInstances: PropTypes.number.isRequired,
  };

  static defaultProps = {
    body: '',
  };

  constructor(props) {
    super(props);

    this.state = { numInstances: props.numInstances, maxInstances: 999 };
  }

  doIt() {
    this.props.onProceed(this.state.numInstances);
    this.props.hideModal();
  }

  scaleChanged(value) {
    this.setState({ numInstances: value });
  }

  render() {
    return (
      <Dialog
        id="container-actions-modal"
        visible={this.props.actionsModal.visible}
        title={this.props.title}
        modal={false}
        closeOnEsc
        onHide={() => this.props.hideModal()}
        actions={[
          {
            onClick: () => this.props.hideModal(),
            label: 'Cancel',
          },
          {
            onClick: () => this.doIt(),
            primary: true,
            label: 'Scale',
            disabled: !this.state.numInstances || this.state.numInstances > this.state.maxInstances,
          }]}
      >
        <div className="flex-row">
          <div className="flex-row center-center">
            <TextField
              id="container-scaleto"
              className="flex-6"
              label="Scale to"
              lineDirection="center"
              type="number"
              value={this.state.numInstances}
              min={0}
              max={this.state.maxInstances}
              onChange={value => this.scaleChanged(value)}
              required
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
  };
}

export default connect(mapStateToProps, actions)(ConfirmModal);
