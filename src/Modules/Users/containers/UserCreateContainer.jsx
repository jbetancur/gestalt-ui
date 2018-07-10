import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withOrganizations, withUser, withUsers } from 'Modules/MetaResource';
import UserForm from './UserForm';
import validate from '../validations';
import actions from '../actions';

class UserCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired,
    organizationsActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, organizationsActions } = this.props;

    organizationsActions.fetchAllOrgsDropDown({ fqon: match.params.fqon });
  }

  create = (values) => {
    const { history, match, userActions } = this.props;
    const onSuccess = () => history.replace(`/${match.params.fqon}/users`);

    userActions.createUser({ fqon: match.params.fqon, payload: values, onSuccess });
  }

  render() {
    return (
      <UserForm
        title="Create User"
        submitLabel="Create"
        cancelLabel="Users"
        onSubmit={this.create}
        {...this.props}
      />
    );
  }
}

function mapStateToProps() {
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
    initialValues: model
  };
}

export default compose(
  withOrganizations(),
  withUser(),
  withUsers(),
  connect(mapStateToProps, actions),
  reduxForm({
    form: 'userCreate',
    validate
  })
)(UserCreate);
