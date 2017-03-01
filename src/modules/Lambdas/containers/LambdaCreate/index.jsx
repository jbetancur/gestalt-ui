import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import base64 from 'base-64';
import { cloneDeep, map } from 'lodash';
import CircularActivity from 'components/CircularActivity';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import * as actions from '../../actions';

class LambdaCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createLambda: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    pendingEnv: PropTypes.bool.isRequired,
    fetchEnv: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params, fetchEnv } = this.props;
    fetchEnv(params.fqon, params.environmentId);
  }

  componentWillUnmount() {
    const { onUnload } = this.props;
    onUnload();
  }

  create(values) {
    const { params, createLambda } = this.props;
    const payload = cloneDeep(values);

    // TODO: Workaround: Lambda providers is really an array - should be an object
    payload.properties.providers = [{ id: values.properties.providers, locations: [] }];

    // Clean up properties depending on lambda code_type
    if (values.properties.code_type === 'package') {
      delete payload.properties.code;
    } else {
      delete payload.properties.package_url;
      delete payload.properties.compressed;
      payload.properties.code = base64.encode(payload.properties.code);
    }

    delete payload.variables;
    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.name] = variable.value;
      });
    }

    createLambda(params.fqon, params.workspaceId, params.environmentId, payload);
  }

  render() {
    return this.props.pendingEnv ? <CircularActivity id="container-load" /> : <LambdaForm title={<span>Create Lambda</span>} submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { lambda, pending } = state.lambdas.fetchOne;
  const variables = map(Object.assign({}, state.lambdas.env.env), (value, name) => ({ name, value }));

  return {
    lambda,
    pending,
    pendingEnv: state.lambdas.env.pending,
    pendingProviders: state.lambdas.providers.pending,
    providers: state.lambdas.providers.providers,
    initialValues: {
      name: '',
      properties: {
        env: {},
        headers: {
          Accept: 'text/plain'
        },
        code: '',
        code_type: 'package',
        compressed: false,
        cpus: 0.1,
        memory: 512,
        timeout: 30,
        handler: '',
        package_url: '',
        public: true,
        synchronous: true,
        runtime: 'nodejs',
        // Providers is really an array of {id, locations[]}
        providers: '',
      },
      variables,
    },
    enableReinitialize: true,
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'lambdaCreate',
  validate
})(LambdaCreate));

