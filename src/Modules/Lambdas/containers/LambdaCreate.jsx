import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
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
import iconMap from '../../Providers/config/iconMap';

const focusOnErrors = createDecorator();

class LambdaCreate extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    lambdaActions: PropTypes.object.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    executors: PropTypes.array.isRequired,
    providers: PropTypes.array.isRequired,
    secrets: PropTypes.array.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    lambdaStateActions: PropTypes.object.isRequired,
    selectedRuntime: PropTypes.object.isRequired,
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
      match,
      lambdaPending,
      initialFormValues,
      selectedRuntime,
    } = this.props;

    const icon = selectedRuntime.value ? iconMap(selectedRuntime.value) : null;

    return (
      <Row center>
        <Col flex={10} xs={12} sm={12} md={10}>
          <ActionsToolbar
            title="Create a Lambda"
            titleIcon={icon}
          />

          {lambdaPending && <ActivityContainer id="lambda-form" />}

          <FinalForm
            onSubmit={this.create}
            initialValues={initialFormValues}
            validate={validate}
            decorators={[focusOnErrors]}
            mutators={{ ...arrayMutators }}
            render={({ handleSubmit, values, pristine, submitting, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                disabled={lambdaPending}
                submitTitle="Create"
                submitDisabled={pristine || submitting || !values.properties.runtime || !values.properties.provider.id}
                cancelDisabled={lambdaPending || submitting}
                showCancel
                cancelTo={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/lambdas`}
              >
                <LambdaForm values={values} {...rest} />
              </Form>
            )}
            {...this.props}
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
