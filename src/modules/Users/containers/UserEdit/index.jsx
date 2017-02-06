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
    updateUser: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired
  };

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchUser(params.fqon, params.userId);
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
  const { item, pending } = state.users.fetchOne;
  const { organizations, pendingOrgs } = state.users.fetchOrgs;

  return {
    user: item,
    organizations,
    pending,
    pendingOrgs,
    updatePending: state.users.updateOne.pending,
    initialValues: {
      name: item.name,
      description: item.description,
      properties: {
        password: item.properties.password,
        firstName: item.properties.firstName,
        lastName: item.properties.lastName,
        email: item.properties.email,
        phoneNumber: item.properties.phoneNumber,
        gestalt_home: item.properties.gestalt_home
      }
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'userEdit',
  validate
})(GroupEdit));
