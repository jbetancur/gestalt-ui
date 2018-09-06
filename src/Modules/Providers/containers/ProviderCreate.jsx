import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Col, Row } from 'react-flexybox';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPayload } from '../payloadTransformer';
import { getCreateProviderModel } from '../selectors';
import { generateResourceTypeSchema } from '../lists/providerTypes';

class ProviderCreate extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createProvider: PropTypes.func.isRequired,
    fetchEnvSchema: PropTypes.func.isRequired,
    unloadEnvSchema: PropTypes.func.isRequired,
    providerPending: PropTypes.bool.isRequired,
    resourcetypesData: PropTypes.array.isRequired,
  };

  state = {
    selectedProviderType: {},
  };

  componentDidCatch(error, info) {
    // TODO: Eat errors related to calling fetchEnvSchema and redux-form FieldArrays and don't unmount the form
    this.setState({ hasError: true, error, info });
  }

  componentWillUnmount() {
    this.props.unloadEnvSchema();
  }

  create = (values) => {
    const { match, history, createProvider } = this.props;
    const { selectedProviderType } = this.state;
    const payload = generateProviderPayload(values, selectedProviderType.allowContainer);

    const onSuccess = () => {
      if (match.params.workspaceId && !match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers`);
      } else if (match.params.workspaceId && match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers`);
      } else {
        history.push(`/${match.params.fqon}/providers`);
      }
    };

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

  handleProviderTypeChange = (provider) => {
    const { resourcetypesData, fetchEnvSchema } = this.props;
    const compiledProviderTypes = generateResourceTypeSchema(resourcetypesData);
    const selectedProviderType = compiledProviderTypes.find(type => type.name === provider.type) || {};

    if (selectedProviderType.id) {
      fetchEnvSchema(selectedProviderType.id);
    }

    this.setState({ selectedProviderType });
  }

  render() {
    const { initialValues, providerPending } = this.props;
    const { selectedProviderType } = this.state;

    return (
      <Row center gutter={5}>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={selectedProviderType.name ? `Create a ${selectedProviderType.displayName} Provider` : 'Create a Provider'}
          />

          {providerPending && <ActivityContainer id="provider-form" />}

          <Form
            component={ProviderForm}
            initialValues={initialValues}
            validate={validate(selectedProviderType.allowContainer)}
            mutators={{ ...arrayMutators }}
            onSubmit={this.create}
            goBack={this.goBack}
            selectedProviderType={selectedProviderType}
            onSelecedProviderType={this.handleProviderTypeChange}
            keepDirtyOnReinitialize // prevents losing selected providerType when it is selected
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getCreateProviderModel(state),
});

export default compose(
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false, params: { type: 'Gestalt::Configuration::Provider' } }),
  withPickerData({ entity: 'providers', label: 'Providers', params: { expand: false } }),
  withMetaResource,
  connect(mapStateToProps, actions),
)(ProviderCreate);
