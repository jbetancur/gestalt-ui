import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import base64 from 'base-64';
import { cloneDeep, map } from 'lodash';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import actions from '../../actions';

class LambdaCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createLambda: PropTypes.func.isRequired,
    envPending: PropTypes.bool.isRequired,
    fetchEnv: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchEnv } = this.props;

    fetchEnv(match.params.fqon, match.params.environmentId, 'environments');
  }

  create(values) {
    const { match, history, createLambda } = this.props;
    const payload = cloneDeep(values);
    // TODO: fake locations for now
    payload.properties.provider = { id: values.properties.provider.id, locations: [] };

    // Clean up properties depending on lambda code_type
    if (values.properties.code_type === 'package') {
      delete payload.properties.code;
    } else {
      delete payload.properties.package_url;
      delete payload.properties.compressed;
      payload.properties.code = base64.encode(payload.properties.code);
    }

    if (values.properties.periodic_info && !values.properties.periodic_info.schedule) {
      delete payload.properties.periodic_info.payload;
      delete payload.properties.periodic_info.timezone;
    }

    if (values.properties.periodic_info &&
      values.properties.periodic_info.schedule &&
      values.properties.periodic_info.payload &&
      values.properties.periodic_info.payload.data) {
      payload.properties.periodic_info.payload.data = base64.encode(payload.properties.periodic_info.payload.data);
    }

    delete payload.variables;
    if (values.variables) {
      values.variables.forEach((variable) => {
        payload.properties.env[variable.name] = variable.value;
      });
    }

    const onSuccess = () => {
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);
    };

    createLambda(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return this.props.envPending ? <ActivityContainer id="container-load" /> :
    <LambdaForm
      title="Create Lambda"
      submitLabel="Create"
      cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
      onSubmit={values => this.create(values)}
      {...this.props}
    />;
  }
}

function mapStateToProps(state) {
  const variables = map(Object.assign({}, state.metaResource.env.env), (value, name) => ({ name, value }));

  return {
    theme: state.lambdas.theme,
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
        runtime: '',
        // Providers is really an array of {id, locations[]}
        provider: {},
        periodic_info: {
          payload: {},
        },
      },
      variables,
    },
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'lambdaCreate',
  validate
})(withContext(LambdaCreate))));

