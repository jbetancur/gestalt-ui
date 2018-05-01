import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import Div from 'components/Div';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { ContainerCreate } from 'Modules/Containers';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPayload } from '../payloadTransformer';
import { getCreateProviderModel } from '../selectors';
import { generateResourceTypeSchema } from '../lists/providerTypes';

class ProviderCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createProvider: PropTypes.func.isRequired,
    /* container related */
    containerValues: PropTypes.object,
    unloadEnvSchema: PropTypes.func.isRequired,
    providerPending: PropTypes.bool.isRequired,
    providerValues: PropTypes.object.isRequired,
    resourcetypesData: PropTypes.array.isRequired,
  };

  static defaultProps = {
    containerValues: {},
  };

  componentWillUnmount() {
    this.props.unloadEnvSchema();
  }

  create = (values) => {
    const { match, history, createProvider, containerValues } = this.props;

    const payload = generateProviderPayload(values, containerValues);
    const onSuccess = () => {
      if (match.params.workspaceId && !match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`);
      } else if (match.params.workspaceId && match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`);
      } else {
        history.push(`/${match.params.fqon}/providers`);
      }
    };

    // Create it
    if (match.params.workspaceId && !match.params.environmentId) {
      createProvider(match.params.fqon, match.params.workspaceId, 'workspaces', payload, onSuccess);
    } else if (match.params.environmentId) {
      createProvider(match.params.fqon, match.params.environmentId, 'environments', payload, onSuccess);
    } else {
      createProvider(match.params.fqon, null, null, payload, onSuccess);
    }
  }

  goBack = () => {
    const { match, history } = this.props;
    if (match.params.workspaceId && !match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`);
    } else if (match.params.workspaceId && match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`);
    } else {
      history.push(`/${match.params.fqon}/providers`);
    }
  };

  componentDidCatch(error, info) {
    // TODO: Eeat errors related to calling fetchEnvSchema and redux-form FieldArrays and don't unmount the form
    this.setState({ hasError: true, error, info });
  }

  render() {
    const { providerPending, resourcetypesData, providerValues } = this.props;
    const compiledProviderTypes = generateResourceTypeSchema(resourcetypesData);
    const selectedProviderType = compiledProviderTypes.find(type => type.name === providerValues.resource_type) || {};
    const showContainer = selectedProviderType.allowContainer;

    return (
      <Row center gutter={5}>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={selectedProviderType.name ? `Create a ${selectedProviderType.displayName} Provider` : 'Create a Provider'}
          />

          {providerPending && <ActivityContainer id="provider-form" />}

          <ProviderForm
            onSubmit={this.create}
            showContainer={showContainer}
            goBack={this.goBack}
            selectedProviderType={selectedProviderType}
            {...this.props}
          />

          {showContainer &&
            <Row gutter={10} component={Div} pending={providerPending}>
              <Col flex={12}>
                <Panel title="Container Specification" defaultExpanded={showContainer}>
                  <Caption light>{`The provider type ${selectedProviderType.displayName} requires a container`}</Caption>
                  <ContainerCreate inlineMode />
                </Panel>
              </Col>
            </Row>}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    provider: getCreateProviderModel(state),
    initialValues: getCreateProviderModel(state),
    enableReinitialize: true,
    keepDirtyOnReinitialize: true, // keeps dirty values in forms when the provider type is changed
    containerValues: getFormValues('containerCreate')(state),
    providerValues: getFormValues('providerCreate')(state),
  };
}

export default compose(
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false, params: { type: 'Gestalt::Configuration::Provider' } }),
  withPickerData({ entity: 'providers', label: 'Providers', params: { expand: false } }),
  withMetaResource,
  connect(mapStateToProps, { ...actions }),
  reduxForm({
    form: 'providerCreate',
    validate,
  }),
)(ProviderCreate);
