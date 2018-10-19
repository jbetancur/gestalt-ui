import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'react-flexybox';
import { DialogContainer, SelectField } from 'react-md';
import actions from '../actions';
import withContext from '../../../Hierarchy/hocs/withContext';

class PromoteModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
  };

  state = { environment: '' };

  doIt = () => {
    const { context: { environments }, onProceed, hideModal } = this.props;

    onProceed(environments.find(env => env.id === this.state.environment));
    hideModal();
  }

  environmentChanged = (environment) => {
    this.setState({ environment });
  }

  render() {
    const { match, context: { environments }, visible, hideModal, title } = this.props;
    const { environment } = this.state;

    const environmentsList = environments
      .filter(e => e.id !== match.params.environmentId)
      .map(e => ({ id: e.id, name: e.description || e.name }));

    return (
      <DialogContainer
        id="container-actions-modal"
        visible={visible}
        title={title}
        modal={false}
        width="24em"
        closeOnEsc
        defaultVisibleTransitionable
        autosizeContent={false}
        onHide={hideModal}
        actions={[
          {
            onClick: hideModal,
            label: 'Cancel',
          },
          {
            onClick: this.doIt,
            primary: true,
            label: 'Promote',
            disabled: !environment,
          }]}
      >
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
                value={environment}
                onChange={this.environmentChanged}
                required
                fullWidth
              />
            </Col>
          </Row> : <span>There are no available environments to promote to</span>}
      </DialogContainer>
    );
  }
}

const mapStateToProps = ({ hierarchy }) => ({
  environments: hierarchy.environments.environments,
  environmentsPending: hierarchy.environments.pending,
});

export default compose(
  withContext(),
  withRouter,
  connect(mapStateToProps, actions),
)(PromoteModal);
