import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import LambdaForm from './LambdaForm';
import validate from '../validations';
import actions from '../actions';
import { generatePayload } from '../payloadTransformer';
import { getCreateLambdaModel } from '../selectors';

class LambdaCreate extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createLambda: PropTypes.func.isRequired,
    envPending: PropTypes.bool.isRequired,
    fetchEnv: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchEnv } = this.props;

    fetchEnv(match.params.fqon, match.params.environmentId, 'environments');
  }

  create(values) {
    const { match, history, createLambda } = this.props;
    const payload = generatePayload(values);

    const onSuccess = (response) => {
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/lambdas/${response.id}`);
    };

    createLambda(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return (
      <div>
        {this.props.envPending ?
          <ActivityContainer id="container-load" /> :
          <LambdaForm
            title="Create Lambda"
            submitLabel="Create"
            cancelLabel="Lambdas"
            onSubmit={values => this.create(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lambda: getCreateLambdaModel(state),
    initialValues: getCreateLambdaModel(state),
    theme: state.lambdas.theme,
  };
}

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'Lambda' } }),
  withPickerData({ entity: 'providers', alias: 'executors', label: 'Executors', params: { type: 'Executor' }, }),
  withMetaResource,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'lambdaCreate',
    enableReinitialize: true,
    validate,
  })
)(LambdaCreate);
