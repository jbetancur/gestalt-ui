import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'react-md';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';
import { media } from 'util/helpers/media';

const DialogContentCustom = styled(DialogContent)`
  width: 400px;
  ${() => media.xs`
    width: auto;
  `};
  ${() => media.sm`
    width: auto;
  `};
`;

class ConfirmModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    numInstances: PropTypes.number.isRequired,
  };

  state = { numInstances: this.props.numInstances, maxInstances: 999 };

  doIt = () => {
    const { modal, onProceed } = this.props;
    const { numInstances } = this.state;

    onProceed(numInstances);
    modal.hideModal();
  }

  scaleChanged = (numInstances) => {
    this.setState({ numInstances });
  }

  render() {
    const { modal, title } = this.props;
    const { numInstances, maxInstances } = this.state;
    const isDisabled = !numInstances || numInstances > maxInstances;

    return (
      <Dialog
        id="container-scale-modal"
        aria-labelledby="ccontainer-scale-title"
        aria-describedby="container-scale-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="sm"
      >
        <DialogTitle id="ccontainer-scale-title">{title}</DialogTitle>
        <DialogContentCustom>
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
        </DialogContentCustom>
        <DialogActions>
          <Button raised primary onClick={this.doIt} disabled={isDisabled}>Scale</Button>
          <Button flat primary onClick={modal.hideModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmModal;
