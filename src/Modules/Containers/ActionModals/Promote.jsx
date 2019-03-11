import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import SelectField from 'components/Fields/SelectField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FlatButton } from 'components/Buttons';
import withContext from '../../Hierarchy/hocs/withContext';

class PromoteModal extends PureComponent {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
  };

  state = { selectedEnvironment: '' };

  doIt = () => {
    const { modal, hierarchyContext, onProceed } = this.props;
    const { context: { environments } } = hierarchyContext;
    const { selectedEnvironment } = this.state;

    onProceed(environments.find(env => env.id === selectedEnvironment));
    modal.hideModal();
  }

  environmentChanged = ({ target }) => {
    this.setState({ selectedEnvironment: target.value });
  }

  render() {
    const { modal, hierarchyContext, title } = this.props;
    const { context: { environment, environments } } = hierarchyContext;
    const { selectedEnvironment } = this.state;

    const environmentsList = environments
      .filter(e => e.id !== environment.id)
      .map(e => ({ id: e.id, name: e.description || e.name }));

    return (
      <Dialog
        id="container-promote-modal"
        aria-labelledby="ccontainer-promote-title"
        aria-describedby="container-promote-description"
        open={modal.open}
        onClose={modal.hideModal}
        onExited={modal.destroyModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="ccontainer-promote-title">{title}</DialogTitle>
        <DialogContent>
          {environmentsList.length > 0 ?
            <Row gutter={5} center>
              <Col flex={12}>
                <SelectField
                  id="container-promoteto"
                  label="Promote to Environment"
                  menuItems={environmentsList}
                  itemLabel="name"
                  itemValue="id"
                  value={selectedEnvironment}
                  onChange={this.environmentChanged}
                  required
                  fullWidth
                />
              </Col>
            </Row> : <span>There are no available environments to promote to</span>}
        </DialogContent>
        <DialogActions>
          <FlatButton
            label="Promote"
            variant="contained"
            color="primary"
            onClick={this.doIt}
            disabled={!selectedEnvironment}
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

const mapStateToProps = ({ hierarchy }) => ({
  environments: hierarchy.environments.environments,
  environmentsPending: hierarchy.environments.pending,
});

export default compose(
  withContext(),
  connect(mapStateToProps),
)(PromoteModal);
