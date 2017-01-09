import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import UserForm from '../../components/UserForm';
import validate from '../../validations';
import * as actions from '../../actions';

class UserCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired
  };

  create(values) {
    this.props.createUser(this.props.params.fqon, values);
  }

  render() {
    return <UserForm title="Create User" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { item, pending } = state.users.fetchOne;
  const { organizations, pendingOrgs } = state.users.fetchOrgs;

  return {
    user: item,
    organizations,
    pending,
    pendingOrgs,
    initialValues: {
      name: '',
      properties: {
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gestalt_home: ''
      }
    }
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'userCreate',
  validate
})(UserCreate));
