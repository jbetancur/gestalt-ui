import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import { ActivityContainer } from 'components/ProgressIndicators';
import LambdaForm from './LambdaForm';
import validate from '../validations';
import actions from '../actions';
import { generatePatches } from '../payloadTransformer';
import { getEditLambdaModel, selectLambda } from '../selectors';

class LambdaEdit extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    lambda: PropTypes.object.isRequired,
    fetchLambda: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    updateLambda: PropTypes.func.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    fetchActions: PropTypes.func.isRequired,
    unloadLambda: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchLambda, fetchAPIEndpoints, fetchActions } = this.props;

    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'lambda.detail' });
    fetchLambda(match.params.fqon, match.params.lambdaId);
    fetchAPIEndpoints(match.params.fqon, match.params.lambdaId, 'lambda');
  }

  componentWillUnmount() {
    const { unloadLambda, unloadAPIEndpoints } = this.props;

    unloadLambda();
    unloadAPIEndpoints();
  }

  updateLambda(values) {
    const { lambda, match, dispatch, reset, updateLambda } = this.props;
    const patches = generatePatches(lambda, values);
    const onSuccess = () => dispatch(reset());

    updateLambda(match.params.fqon, lambda.id, patches, onSuccess);
  }

  render() {
    const { lambda, lambdaPending } = this.props;

    return (
      <div>
        {lambdaPending && !lambda.id ?
          <ActivityContainer id="lambda-load" /> :
          <LambdaForm
            editMode
            title={lambda.name}
            submitLabel="Update"
            cancelLabel="Lambdas"
            onSubmit={values => this.updateLambda(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lambda: selectLambda(state),
    initialValues: getEditLambdaModel(state),
    theme: state.lambdas.theme,
  };
}

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'Lambda' } }),
  withPickerData({ entity: 'providers', alias: 'executors', label: 'Executors', params: { type: 'Executor' }, }),
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'lambdaEdit',
    enableReinitialize: true,
    validate,
  })
)(LambdaEdit);
