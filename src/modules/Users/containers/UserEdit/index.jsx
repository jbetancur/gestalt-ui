import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import UserForm from '../../components/UserForm';
import validate from '../../validations';
import * as actions from '../../actions';

class GroupEdit extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchAllOrgsDropDown: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { params, fetchUser, fetchAllOrgsDropDown } = this.props;
    fetchAllOrgsDropDown(params.fqon);
    fetchUser(params.fqon, params.userId);
  }

  update(values) {
    const { params, router, user, updateUser } = this.props;
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
    const onSuccess = () => router.replace(`${params.fqon}/users`);

    updateUser(params.fqon, user.id, patches, onSuccess);
  }

  render() {
    const { user, pending } = this.props;
    return pending ? <CircularActivity id="user-load" /> : <UserForm title={user.name} submitLabel="Update" cancelLabel="Back" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { user, pending } = state.metaResource.user;

  return {
    user,
    pending,
    organizations: state.metaResource.allOrganizationsDropDown.organizations,
    updatePending: state.metaResource.userUpdate.pending,
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

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'userEdit',
  validate
})(GroupEdit));
