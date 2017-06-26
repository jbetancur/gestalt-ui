import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import CircularActivity from 'components/CircularActivity';
import jsonPatch from 'fast-json-patch';
import GroupForm from '../../components/GroupForm';
import validate from '../../validations';
import actions from '../../actions';

class GroupEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    fetchGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchGroup, fetchUsers } = this.props;
    fetchGroup(match.params.fqon, match.params.groupId);
    fetchUsers(match.params.fqon);
  }

  update(values) {
    const { match, group, updateGroup } = this.props;
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
    updateGroup(match.params.fqon, group.id, patches);
  }

  render() {
    const { group, pending } = this.props;
    return pending ? <CircularActivity id="group-loading" /> : <GroupForm editMode title={group.name} submitLabel="Update" cancelLabel="Done" onSubmit={values => this.update(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const { group, pending } = state.metaResource.group;

  return {
    group,
    pending,
    updatedGroup: state.metaResource.groupMembers.group,
    updateMembersPending: state.metaResource.groupMembers.pending,
    updatePending: state.metaResource.groupUpdate.pending,
    users: state.metaResource.users.users.filter(val => val.name.includes(state.groups.availableUsersFilter.filterText)),
    pendingUsers: state.metaResource.users.pending,
    memberUsersFilter: state.groups.memberUsersFilter,
    availableUsersFilter: state.groups.availableUsersFilter,
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

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'groupEdit',
  validate
})(context(GroupEdit)));
