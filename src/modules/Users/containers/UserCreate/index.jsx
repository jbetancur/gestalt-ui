import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import UserForm from '../../components/UserForm';
import validate from '../../validations';
import * as actions from '../../actions';

class UserCreate extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
  };

  create(values) {
    const { router, params, createUser } = this.props;
    const onSuccess = () => router.replace(`${params.fqon}/users`);

    createUser(params.fqon, values, onSuccess);
  }

  render() {
    return <UserForm title="Create User" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { pending } = state.metaResource.user;
  const model = {
    name: '',
    properties: {
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gestalt_home: ''
    }
  };

  return {
    user: model,
    pending,
    organizations: state.metaResource.allOrganizationsDropDown.organizations,
    initialValues: model
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'userCreate',
  validate
})(UserCreate));
