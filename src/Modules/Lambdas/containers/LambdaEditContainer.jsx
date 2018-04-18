import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, withLambda, withPickerData } from 'Modules/MetaResource';
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
    lambdaActions: PropTypes.object.isRequired,
    fetchAPIEndpoints: PropTypes.func.isRequired,
    lambdaPending: PropTypes.bool.isRequired,
    unloadAPIEndpoints: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, lambdaActions, fetchAPIEndpoints } = this.props;

    lambdaActions.fetchLambda({ fqon: match.params.fqon, lambdaId: match.params.lambdaId });
    fetchAPIEndpoints(match.params.fqon, match.params.lambdaId, 'lambda');
  }

  componentWillUnmount() {
    const { unloadAPIEndpoints } = this.props;

    unloadAPIEndpoints();
  }

  updateLambda(values) {
    const { lambda, match, dispatch, reset, lambdaActions } = this.props;
    const payload = generatePatches(lambda, values);
    const onSuccess = () => dispatch(reset());

    lambdaActions.updateLambda({ fqon: match.params.fqon, lambdaId: lambda.id, payload, onSuccess });
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
  withLambda,
  withMetaResource,
  withEntitlements,
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'lambdaEdit',
    enableReinitialize: true,
    validate,
  })
)(LambdaEdit);
