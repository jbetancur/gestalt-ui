import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { DialogContainer, SelectField } from 'react-md';
import actions from '../actions';
import withContext from '../../../Hierarchy/hocs/withContext';

const EnhancedDialog = styled(DialogContainer)`
  .md-dialog {
    min-width: 24em;
  }

  /* Fix Scrolling issue in dialogs with drop downs */
  .md-dialog-content {
    overflow: visible;
  }
`;

class PromoteModal extends PureComponent {
  static propTypes = {
    actionsModal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { environment: '' };
  }

  doIt = () => {
    const { context: { environments }, onProceed, hideModal } = this.props;

    onProceed(environments.find(env => env.id === this.state.environment));
    hideModal();
  }

  environmentChanged = (value) => {
    this.setState({ environment: value });
  }

  render() {
    const { context: { environments } } = this.props;

    const environmentsList = environments
      .filter(environment => environment.id !== this.props.match.params.environmentId)
      .map(environment => ({ id: environment.id, name: environment.description || environment.name }));

    return (
      <EnhancedDialog
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
            label: 'Promote',
            disabled: !this.state.environment,
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
                itemLabel="name"
                itemValue="id"
                value={this.state.environment}
                onChange={this.environmentChanged}
                required
                fullWidth
              />
            </Col>
          </Row> : <span>There are no available environments to promote to</span>}
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
    environments: state.hierarchy.environments.environments,
    environmentsPending: state.hierarchy.environments.pending,
  };
}

export default compose(
  withContext({ unload: true }),
  withRouter,
  connect(mapStateToProps, actions),
)(PromoteModal);
