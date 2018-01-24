import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import { withEntitlements } from 'Modules/Entitlements';
import ActivityContainer from 'components/ActivityContainer';
import LambdaForm from '../components/LambdaForm';
import validate from '../validations';
import actions from '../actions';
import { generateLambdaPatches } from '../payloadTransformer';
import { getEditLambdaModel, selectLambda } from '../selectors';

class LambdaEdit extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    lambda: PropTypes.object.isRequired,
    fetchLambda: PropTypes.func.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    fetchExecutors: PropTypes.func.isRequired,
    updateLambda: PropTypes.func.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    fetchActions: PropTypes.func.isRequired,
    unloadLambda: PropTypes.func.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchLambda, fetchAPIEndpoints, fetchProvidersByType, fetchExecutors, fetchActions } = this.props;

    fetchProvidersByType(match.params.fqon, match.params.environmentId, 'environments', 'Lambda');
    fetchExecutors(match.params.fqon, match.params.environmentId, 'environments', 'Executor');
    fetchActions(match.params.fqon, match.params.environmentId, 'environments', { filter: 'lambda.detail' });
    fetchLambda(match.params.fqon, match.params.lambdaId, match.params.environmentId);
    fetchAPIEndpoints(match.params.fqon, match.params.lambdaId, 'lambda');
  }

  componentWillUnmount() {
    const { unloadLambda, unloadAPIEndpoints } = this.props;

    unloadLambda();
    unloadAPIEndpoints();
  }

  updateLambda(values) {
    const { lambda, match, dispatch, reset, updateLambda } = this.props;
    const patches = generateLambdaPatches(lambda, values);
    const onSuccess = () => dispatch(reset());

    updateLambda(match.params.fqon, lambda.id, lambda.properties.parent.id, patches, onSuccess);
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
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'lambdaEdit',
    enableReinitialize: true,
    validate,
  })
)(LambdaEdit);
