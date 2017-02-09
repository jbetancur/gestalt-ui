import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import UserForm from '../../components/UserForm';
import validate from '../../validations';
import * as actions from '../../actions';

class GroupEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchAllOrgs: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params, fetchUser, fetchAllOrgs } = this.props;
    fetchAllOrgs(params.fqon);
    fetchUser(params.fqon, params.userId);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  update(values) {
    const { params, user } = this.props;
    const { name, description, properties: { password, firstName, lastName, phoneNumber, email, gestalt_home } } = user;
    const originalModel = {
      name,
      description,
      properties: {
        password,
        firstName,
        lastName,
        phoneNumber,
        email,
        gestalt_home
      }
    };

    const patches = jsonPatch.compare(originalModel, values);
    this.props.updateUser(params.fqon, user.id, patches);
  }

  render() {
    const { user, pending } = this.props;
    return pending ? <CircularActivity id="user-load" /> : <UserForm title={user.name} submitLabel="Update" cancelLabel="Cancel" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { user, pending } = state.users.fetchOne;
  const { organizations, pendingOrgs } = state.users.fetchOrgs;

  return {
    user,
    organizations,
    pending,
    pendingOrgs,
    updatePending: state.users.updateOne.pending,
    initialValues: {
      name: user.name,
      description: user.description,
      properties: {
        password: user.properties.password,
        firstName: user.properties.firstName,
        lastName: user.properties.lastName,
        email: user.properties.email,
        phoneNumber: user.properties.phoneNumber,
        gestalt_home: user.properties.gestalt_home
      }
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'userEdit',
  validate
})(GroupEdit));
