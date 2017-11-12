import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import { Row, Col } from 'react-flexybox';
import Dialog from 'react-md/lib/Dialogs';
import TextField from 'react-md/lib/TextFields';
import actions from '../actions';

class ConfirmModal extends PureComponent {
  static propTypes = {
    actionsModal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    numInstances: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { numInstances: props.numInstances, maxInstances: 999 };
  }

  doIt = () => {
    this.props.onProceed(this.state.numInstances);
    this.props.hideModal();
  }

  scaleChanged = (value) => {
    this.setState({ numInstances: value });
  }

  render() {
    const isDisabled = !this.state.numInstances || this.state.numInstances > this.state.maxInstances;

    return (
      <Dialog
        id="container-actions-modal"
        visible={this.props.actionsModal.visible}
        title={this.props.title}
        modal={false}
        closeOnEsc
        defaultVisibleTransitionable
        autosizeContent={false}
        onHide={this.props.hideModal}
        actions={[
          {
            onClick: this.props.hideModal,
            label: 'Cancel',
          },
          {
            onClick: this.doIt,
            primary: true,
            label: 'Scale',
            disabled: isDisabled,
          }]}
      >
        <Row center>
          <Col flex={6}>
            <TextField
              id="container-scaleto"
              label="Scale to"
              lineDirection="center"
              type="number"
              value={this.state.numInstances}
              min={0}
              max={this.state.maxInstances}
              onChange={this.scaleChanged}
              required
              fullWidth
            />
          </Col>
        </Row>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
  };
}

export default compose(
  withMetaResource,
  connect(mapStateToProps, actions)
)(ConfirmModal);
