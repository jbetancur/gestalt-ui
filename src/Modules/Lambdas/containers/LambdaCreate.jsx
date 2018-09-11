import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Row, Col } from 'react-flexybox';
import { withLambda, withPickerData, withEnv } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import LambdaForm from './LambdaForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateLambdaModel } from '../selectors';
import withLambdaState from '../hoc/withLambdaState';

class LambdaCreate extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    lambdaActions: PropTypes.object.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    envPending: PropTypes.bool.isRequired,
    envActions: PropTypes.object.isRequired,
    executorsData: PropTypes.array.isRequired,
    providersData: PropTypes.array.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    lambdaStateActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, envActions } = this.props;

    envActions.fetchEnv({ fqon: match.params.fqon, entityId: match.params.environmentId, entityKey: 'environments' });
  }

  componentWillUnmount() {
    const { lambdaStateActions } = this.props;

    lambdaStateActions.setRunTime({});
  }

  create = (values) => {
    const { match, history, lambdaActions, executorsData } = this.props;
    const payload = generatePayload(values);

    if (payload.properties.runtime && executorsData.length) {
      payload.properties.runtime = executorsData.find(exec => exec.id === payload.properties.runtime)
        .properties.config.env.public.RUNTIME;
    }

    const onSuccess = (response) => {
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/lambdas/${response.id}`);
    };

    lambdaActions.createLambda({ fqon: match.params.fqon, environmentId: match.params.environmentId, payload, onSuccess });
  }

  render() {
    const {
      lambdaPending,
      envPending,
      providersData,
      executorsData,
      initialFormValues,
    } = this.props;

    return (
      envPending ?
        <ActivityContainer id="container-load" /> :

        <Row center>
          <Col flex={10} xs={12} sm={12} md={10}>
            <ActionsToolbar title="Create a Lambda" />

            {lambdaPending && <ActivityContainer id="lambda-form" />}

            <Form
              onSubmit={this.create}
              initialValues={initialFormValues}
              render={LambdaForm}
              validate={validate}
              mutators={{ ...arrayMutators }}
              loading={lambdaPending}
              providers={providersData}
              executors={executorsData}
            />
          </Col>
        </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    lambda: getCreateLambdaModel(state),
    initialFormValues: getCreateLambdaModel(state),
    theme: state.lambdas.theme,
  };
}

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'Lambda' } }),
  withPickerData({ entity: 'providers', alias: 'executors', label: 'Executors', params: { type: 'Executor' }, }),
  withLambda,
  withLambdaState,
  withEnv({ unloadEnvSchema: false }),
  connect(mapStateToProps, actions),
)(LambdaCreate);
