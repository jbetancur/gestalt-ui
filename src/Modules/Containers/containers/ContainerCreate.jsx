import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { withContainer, withMetaResource, withPickerData } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { getLastFromSplit } from 'util/helpers/strings';
import ContainerForm from './ContainerForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateContainerModel } from '../selectors';
import ContainerIcon from '../components/ContainerIcon';

class ContainerCreate extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object.isRequired,
    containerActions: PropTypes.object.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    envPending: PropTypes.bool.isRequired,
    inlineMode: PropTypes.bool,
    containerPending: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    inlineMode: false,
    history: {},
  };

  state = { providerType: {} };

  componentDidMount() {
    const { match, fetchEnv } = this.props;

    fetchEnv(match.params.fqon, match.params.environmentId, 'environments');
  }

  setProviderType = (providerType) => {
    this.setState({ providerType });
  }

  create = (values) => {
    const { match, history, containerActions, inlineMode } = this.props;

    if (!inlineMode) {
      const payload = generatePayload(values);
      const onSuccess = (response) => {
        history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/containers/${response.id}`);
      };

      containerActions.createContainer({ fqon: match.params.fqon, environmentId: match.params.environmentId, payload, onSuccess });
    }
  }

  render() {
    const { containerPending, envPending, inlineMode } = this.props;

    return (
      envPending ?
        <ActivityContainer id="container-loading" /> :
        <Row gutter={5} center>
          <Col
            flex={inlineMode ? 12 : 10}
            xs={12}
            sm={12}
            md={12}
          >
            <ActionsToolbar
              title="Deploy a Container"
              titleIcon={<ContainerIcon resourceType={getLastFromSplit(this.state.providerType.resource_type)} />}
            />

            {containerPending && <ActivityContainer id="container-form" />}

            <ContainerForm
              inlineMode={inlineMode}
              onSubmit={this.create}
              onSelectedProvider={this.setProviderType}
              {...this.props}
            />
          </Col>
        </Row>
    );
  }
}

const formName = 'containerCreate';
const mapStateToProps = state => ({
  containerModel: {},
  initialValues: getCreateContainerModel(state),
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withContainer(),
  withMetaResource,
  withRouter,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: formName,
    enableReinitialize: true,
    validate,
  })
)(ContainerCreate);
