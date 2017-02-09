import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import GroupForm from '../../components/GroupForm';
import validate from '../../validations';
import * as actions from '../../actions';

class UserCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    fetchGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    onUnloadGroup: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { params, fetchGroup, fetchUsers } = this.props;
    fetchGroup(params.fqon, params.groupId);
    fetchUsers(params.fqon);
  }

  componentWillUnmount() {
    const { onUnloadGroup } = this.props;
    onUnloadGroup();
  }

  update(values) {
    const { params, group } = this.props;
    const { name, description } = group;

    const originalModel = {
      name,
      description
    };

    const model = {
      name: values.name,
      description: values.description
    };

    const patches = jsonPatch.compare(originalModel, model);
    this.props.updateGroup(params.fqon, group.id, patches);
  }

  render() {
    const { group, pending } = this.props;
    return pending ? <CircularActivity id="group-loading" /> : <GroupForm editMode title={group.name} submitLabel="Update" cancelLabel="Done" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { group } = state.groups.fetchOne;

  return {
    group,
    updatedGroup: state.groups.groupMembers.group,
    users: state.groups.fetchUsers.users.filter(val => val.name.includes(state.groups.availableUsersFilter.filterText)),
    memberUsersFilter: state.groups.memberUsersFilter,
    availableUsersFilter: state.groups.availableUsersFilter,
    pending: state.groups.fetchOne.pending,
    pendingUsers: state.groups.fetchUsers.pending,
    updatePending: state.groups.updateOne.pending,
    updateMembers: state.groups.groupMembers.pending,
    initialValues: {
      name: group.name,
      description: group.description,
      properties: {
        users: group.properties.users
      }
    },
    enableReinitialize: true
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'groupEdit',
  validate
})(UserCreate));
