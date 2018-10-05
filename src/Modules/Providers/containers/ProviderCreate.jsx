import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { Col, Row } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import ProviderForm from './ProviderForm';
import validate from '../validations';
import actions from '../actions';
import { generateProviderPayload } from '../payloadTransformer';
import { getCreateProviderModel } from '../selectors';
import withProvider from '../hocs/withProvider';

const focusOnErrors = createDecorator();

class ProviderCreate extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    providerActions: PropTypes.object.isRequired,
    providerPending: PropTypes.bool.isRequired,
    selectedProviderType: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { providerActions } = this.props;

    providerActions.initProviderCreate();
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  create = (values) => {
    const { match, history, providerActions, selectedProviderType } = this.props;
    const payload = generateProviderPayload(values, selectedProviderType.allowContainer);

    const onSuccess = (response) => {
      if (match.params.workspaceId && !match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/providers/${response.id}`);
      } else if (match.params.workspaceId && match.params.environmentId) {
        history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/providers/${response.id}`);
      } else {
        history.push(`/${match.params.fqon}/providers/${response.id}`);
      }
    };

    if (match.params.workspaceId && !match.params.environmentId) {
      providerActions.createProvider({ fqon: match.params.fqon, entityId: match.params.workspaceId, entityKey: 'workspaces', payload, onSuccess });
    } else if (match.params.environmentId) {
      providerActions.createProvider({ fqon: match.params.fqon, entityId: match.params.environmentId, entityKey: 'environments', payload, onSuccess });
    } else {
      providerActions.createProvider({ fqon: match.params.fqon, payload, onSuccess });
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

  render() {
    const { initialValues, providerPending, selectedProviderType } = this.props;

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
            decorators={[focusOnErrors]}
            onSubmit={this.create}
            goBack={this.goBack}
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
  withProvider(),
  connect(mapStateToProps, actions),
)(ProviderCreate);
