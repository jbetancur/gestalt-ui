import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { withEnvironments } from 'Modules/MetaResource';
import { DialogContainer, SelectField } from 'react-md';
import { DotActivity } from 'components/ProgressIndicators';
import actions from '../actions';

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
    environments: PropTypes.array.isRequired,
    environmentsPending: PropTypes.bool.isRequired,
    environmentsActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { environment: '' };
  }

  componentDidMount() {
    const { environmentsActions } = this.props;

    environmentsActions.fetchEnvironments({ fqon: this.props.match.params.fqon, entityId: this.props.match.params.workspaceId });
  }

  doIt = () => {
    const { environments, onProceed, hideModal } = this.props;

    onProceed(environments.find(env => env.id === this.state.environment));
    hideModal();
  }

  environmentChanged = (value) => {
    this.setState({ environment: value });
  }

  render() {
    const environments = this.props.environments
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
        {this.props.environmentsPending ?
          <DotActivity size={1} primary /> :
          <div>
            {environments.length > 0 ?
              <Row center>
                <Col flex={12}>
                  <SelectField
                    id="container-promoteto"
                    label="Promote to Environment"
                    lineDirection="center"
                    menuItems={environments}
                    itemLabel="name"
                    itemValue="id"
                    value={this.state.environment}
                    onChange={this.environmentChanged}
                    required
                    fullWidth
                  />
                </Col>
              </Row> : <span>There are no available environments to promote to</span>}
          </div>}
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
  withEnvironments({ unload: true }),
  withRouter,
  connect(mapStateToProps, actions),
)(PromoteModal);
