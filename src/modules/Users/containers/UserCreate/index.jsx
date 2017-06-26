import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import UserForm from '../../components/UserForm';
import validate from '../../validations';
import actions from '../../actions';

class UserCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
  };

  create(values) {
    const { history, match, createUser } = this.props;
    const onSuccess = () => history.replace(`/${match.params.fqon}/users`);

    createUser(match.params.fqon, values, onSuccess);
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
})(context(UserCreate)));
