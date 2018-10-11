import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import createDecorator from 'final-form-focus';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import LambdaForm from './LambdaForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateLambdaModel } from '../selectors';
import withLambdaState from '../hocs/withLambdaState';
import withLambda from '../hocs/withLambda';

const focusOnErrors = createDecorator();

class LambdaCreate extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    lambdaActions: PropTypes.object.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    envPending: PropTypes.bool.isRequired,
    executors: PropTypes.array.isRequired,
    providers: PropTypes.array.isRequired,
    secrets: PropTypes.array.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    lambdaStateActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { lambdaActions } = this.props;
    lambdaActions.initLambdaCreate();
  }

  componentWillUnmount() {
    const { lambdaStateActions } = this.props;

    lambdaStateActions.setRunTime({});
  }

  create = (values) => {
    const { match, history, lambdaActions, executors } = this.props;
    const payload = generatePayload(values);

    if (payload.properties.runtime && executors.length) {
      payload.properties.runtime = executors.find(exec => exec.id === payload.properties.runtime)
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
      providers,
      executors,
      secrets,
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
              decorators={[focusOnErrors]}
              mutators={{ ...arrayMutators }}
              loading={lambdaPending}
              providers={providers}
              executors={executors}
              secrets={secrets}
            />
          </Col>
        </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    initialFormValues: getCreateLambdaModel(state),
    theme: state.lambdas.theme,
  };
}

export default compose(
  withLambda(),
  withLambdaState,
  connect(mapStateToProps, actions),
)(LambdaCreate);
