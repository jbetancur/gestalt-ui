import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { mapTo2DArray } from 'util/helpers/transformations';
import { withContext, Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import actions from '../../actions';
import { generateLambdaPayload } from '../../payloadTransformer';

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
    const payload = generateLambdaPayload(values);

    const onSuccess = () => {
      history.replace(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);
    };

    createLambda(match.params.fqon, match.params.environmentId, payload, onSuccess);
  }

  render() {
    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        {this.props.envPending ?
          <ActivityContainer id="container-load" /> :
          <LambdaForm
            title="Create Lambda"
            submitLabel="Create"
            cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.create(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    theme: state.lambdas.theme,
    initialValues: {
      name: '',
      properties: {
        env: mapTo2DArray(state.metaResource.env.env),
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
    },
    enableReinitialize: true,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'lambdaCreate',
  validate
})(withContext(LambdaCreate))));

