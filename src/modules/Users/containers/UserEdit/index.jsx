import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import jsonPatch from 'fast-json-patch';
import UserForm from '../../components/UserForm';
import validate from '../../validations';
import actions from '../../actions';

class GroupEdit extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchAllOrgsDropDown: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    userPending: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchUser, fetchAllOrgsDropDown } = this.props;
    fetchAllOrgsDropDown(match.params.fqon);
    fetchUser(match.params.fqon, match.params.userId);
  }

  update(values) {
    const { match, history, user, updateUser } = this.props;
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
    const onSuccess = () => history.replace(`/${match.params.fqon}/users`);

    updateUser(match.params.fqon, user.id, patches, onSuccess);
  }

  render() {
    const { user, userPending } = this.props;
    return userPending ? <ActivityContainer id="user-load" /> :
    <UserForm
      title={user.name}
      submitLabel="Update"
      cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
      onSubmit={values => this.update(values)}
      {...this.props}
    />;
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
      }
    },
    enableReinitialize: true
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'userEdit',
  validate
})(withContext(GroupEdit))));
