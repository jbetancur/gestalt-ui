import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import LambdaForm from '../../components/LambdaForm';
import validate from '../../validations';
import * as actions from '../../actions';

class LambdaCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createLambda: PropTypes.func.isRequired
  };

  create(values) {
    const { params } = this.props;
    this.props.createLambda(params.fqon, values);
  }

  render() {
    return <LambdaForm title="Create Lambda" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { item, pending } = state.users.fetchOne;
  return {
    lambda: item,
    pending,
    initialValues: {
      name: '',
      properties: {
        env: {},
        code_type: 'package',
        compressed: false,
        cpus: 0.2,
        memory: 512,
        handler: '',
        package_url: '',
        headers: {
          Accept: 'text/plain'
        },
        public: false,
        runtime: 'nodejs',
        synchronous: false,
        timeout: 30
      }
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'lambdaCreate',
  validate
})(LambdaCreate));
