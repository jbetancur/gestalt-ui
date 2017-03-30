import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import APIForm from '../../components/APIForm';
import validate from '../../validations';
import * as actions from '../../actions';

class APICreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createAPI: PropTypes.func.isRequired,
  };

  create(values) {
    const { params, router, createAPI } = this.props;

    const onSuccess = response => router.replace(`${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/apis/${response.id}/edit`);
    createAPI(params.fqon, params.environmentId, values, onSuccess);
  }

  render() {
    return <APIForm title="Create API" submitLabel="Create" cancelLabel="Back" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.api;
  const model = {
    name: '',
    description: '',
    properties: {
      provider: {
        locations: ['notimplemented'],
      },
    }
  };

  return {
    api: model,
    pending,
    providers: state.metaResource.providersByType.providers,
    pendingProviders: state.metaResource.providersByType.pending,
    initialValues: model,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'APICreate',
  validate
})(APICreate));
