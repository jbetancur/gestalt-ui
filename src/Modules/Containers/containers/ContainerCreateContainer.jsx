import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import { healthCheckModalActions } from 'Modules/HealthCheckModal';
import ActivityContainer from 'components/ActivityContainer';
import ContainerForm from '../components/ContainerForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateContainerModel } from '../selectors';

class ContainerCreate extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object.isRequired,
    createContainer: PropTypes.func.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    unloadHealthChecks: PropTypes.func.isRequired,
    healthChecks: PropTypes.array.isRequired,
    envPending: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool,
    fetchActions: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
    history: {},
  };

  componentDidMount() {
    const { match, fetchProvidersByType, fetchEnv, fetchActions } = this.props;

    fetchProvidersByType(match.params.fqon, match.params.environmentId, 'environments', 'CaaS');
    fetchEnv(match.params.fqon, match.params.environmentId, 'environments');
    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'container.detail' });
  }

  componentWillUnmount() {
    const { unloadHealthChecks } = this.props;

    unloadHealthChecks();
  }

  create = (values) => {
    const { match, history, createContainer, healthChecks, inlineMode } = this.props;

    if (!inlineMode) {
      const mergeProps = [
        {
          key: 'health_checks',
          value: healthChecks,
        }
      ];

      const payload = generatePayload(values, mergeProps);
      const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers/${response.id}`);

      createContainer(match.params.fqon, match.params.environmentId, payload, onSuccess);
    }
  }

  render() {
    return (
      <div>
        {this.props.envPending ?
          <ActivityContainer id="container-load" /> :
          <ContainerForm
            inlineMode={this.props.inlineMode}
            title="Deploy Container"
            submitLabel="Deploy"
            cancelLabel="Containers"
            onSubmit={this.create}
            {...this.props}
          />}
      </div>
    );
  }
}

const formName = 'containerCreate';
const mapStateToProps = state => ({
  containerModel: {},
  initialValues: getCreateContainerModel(state),
  healthCheckModal: state.healthCheckModal.healthCheckModal,
  healthChecks: state.healthCheckModal.healthChecks.healthChecks,
});

export default compose(
  withMetaResource,
  withRouter,
  connect(mapStateToProps, Object.assign({}, actions, healthCheckModalActions)),
  reduxForm({
    form: formName,
    enableReinitialize: true,
    validate,
  })
)(ContainerCreate);
