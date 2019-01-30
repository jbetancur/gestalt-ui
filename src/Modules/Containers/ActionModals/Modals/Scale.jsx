import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { DialogContainer, TextField } from 'react-md';
import actions from '../actions';

class ConfirmModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    numInstances: PropTypes.number.isRequired,
  };

  state = { numInstances: this.props.numInstances, maxInstances: 999 };

  doIt = () => {
    const { onProceed, hideModal } = this.props;
    const { numInstances } = this.state;

    onProceed(numInstances);
    hideModal();
  }

  scaleChanged = (numInstances) => {
    this.setState({ numInstances });
  }

  render() {
    const { visible, hideModal, title } = this.props;
    const { numInstances, maxInstances } = this.state;
    const isDisabled = !numInstances || numInstances > maxInstances;

    return (
      <DialogContainer
        id="container-actions-modal"
        visible={visible}
        title={title}
        modal={false}
        closeOnEsc
        defaultVisibleTransitionable
        autosizeContent={false}
        onHide={hideModal}
        width="20%"
        actions={[
          {
            onClick: hideModal,
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
              value={numInstances}
              min={0}
              max={maxInstances}
              onChange={this.scaleChanged}
              required
              fullWidth
            />
          </Col>
        </Row>
      </DialogContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
  };
}

export default compose(
  connect(mapStateToProps, actions)
)(ConfirmModal);
