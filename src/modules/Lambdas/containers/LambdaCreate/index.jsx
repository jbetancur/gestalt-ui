import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import base64 from 'base-64';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import * as actions from '../../actions';

class LambdaCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createLambda: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    const { onUnload } = this.props;
    onUnload();
  }

  create(values) {
    const { params, createLambda } = this.props;
    const payload = { ...values };

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
        payload.properties.env[variable.key] = variable.value;
      });
    }

    createLambda(params.fqon, params.workspaceId, params.environmentId, payload);
  }

  render() {
    return <LambdaForm title={<span>Create Lambda</span>} submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { lambda, pending } = state.lambdas.fetchOne;
  return {
    lambda,
    pending,
    pendingProviders: state.lambdas.providers.pending,
    providers: state.lambdas.providers.providers,
    initialValues: {
      name: '',
      properties: {
        env: {},
        headers: {
          Accept: ''
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
      }
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'lambdaCreate',
  validate
})(LambdaCreate));

