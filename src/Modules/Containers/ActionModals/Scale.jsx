import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import TextField from 'components/Fields/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FlatButton } from 'components/Buttons';

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

  scaleChanged = ({ target }) => {
    this.setState({ numInstances: target.value });
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
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="container-scale-title">{title}</DialogTitle>
        <DialogContent>
          <Row gutter={5} center>
            <Col flex={6}>
              <TextField
                id="container-scaleto"
                label="Scale to"
                type="number"
                value={numInstances}
                min={0}
                max={maxInstances}
                onChange={this.scaleChanged}
                required
              />
            </Col>
          </Row>
        </DialogContent>
        <DialogActions>
          <FlatButton
            label="Scale"
            variant="contained"
            color="primary"
            onClick={this.doIt}
            disabled={isDisabled}
          />
          <FlatButton
            label="Cancel"
            onClick={modal.hideModal}
          />
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmModal;
