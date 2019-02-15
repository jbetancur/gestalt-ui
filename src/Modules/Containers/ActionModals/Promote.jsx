import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import { SelectField } from 'react-md';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/Buttons';
import { media } from 'util/helpers/media';
import withContext from '../../Hierarchy/hocs/withContext';

const DialogContentCustom = styled(DialogContent)`
  width: 400px;
  ${() => media.xs`
    width: auto;
  `};
  ${() => media.sm`
    width: auto;
  `};
`;

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

  environmentChanged = (selectedEnvironment) => {
    this.setState({ selectedEnvironment });
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
          {environmentsList.length > 0 ?
            <Row center>
              <Col flex={12}>
                <SelectField
                  id="container-promoteto"
                  label="Promote to Environment"
                  lineDirection="center"
                  menuItems={environmentsList}
                  simplifiedMenu={false}
                  itemLabel="name"
                  itemValue="id"
                  value={selectedEnvironment}
                  onChange={this.environmentChanged}
                  required
                  fullWidth
                  sameWidth
                />
              </Col>
            </Row> : <span>There are no available environments to promote to</span>}
        </DialogContentCustom>
        <DialogActions>
          <Button raised primary onClick={this.doIt} disabled={!selectedEnvironment}>Promote</Button>
          <Button flat primary onClick={modal.hideModal}>Cancel</Button>
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
