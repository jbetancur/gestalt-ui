import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, withOrganizations } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import jsonPatch from 'fast-json-patch';
import UserForm from './UserForm';
import validate from '../validations';
import actions from '../actions';

class GroupEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
    organizationsActions: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    userPending: PropTypes.bool.isRequired,
    unloadUser: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match, fetchUser, organizationsActions } = this.props;

    organizationsActions.fetchAllOrgsDropDown({ fqon: match.params.fqon });
    fetchUser(match.params.fqon, match.params.userId);
  }

  componentWillUnmount() {
    const { unloadUser } = this.props;

    unloadUser();
  }

  update(values) {
    const { match, user, updateUser } = this.props;
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

    // Clear the password from the payload if its undefined
    if (user.id && !values.password) {
      delete originalModel.properties.password;
    }

    const patches = jsonPatch.compare(originalModel, values);

    updateUser(match.params.fqon, user.id, patches);
  }

  render() {
    const { user, userPending } = this.props;
    return (
      <div>
        {userPending && !user.id ?
          <ActivityContainer id="user-load" /> :
          <UserForm
            title={user.name}
            submitLabel="Update"
            cancelLabel="Users"
            onSubmit={values => this.update(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.metaResource.user;

  return {
    user,
    initialValues: {
      name: user.name,
      description: user.description,
      properties: {
        firstName: user.properties.firstName,
        lastName: user.properties.lastName,
        email: user.properties.email,
        phoneNumber: user.properties.phoneNumber,
        gestalt_home: user.properties.gestalt_home
      },
    },
  };
}

export default compose(
  withMetaResource,
  withOrganizations(),
  connect(mapStateToProps, Object.assign({}, actions)),
  reduxForm({
    form: 'userEdit',
    enableReinitialize: true,
    validate,
  }),
)(GroupEdit);
