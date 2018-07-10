import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource, withUsers, metaModels } from 'Modules/MetaResource';
import { ActivityContainer } from 'components/ProgressIndicators';
import jsonPatch from 'fast-json-patch';
import GroupForm from './GroupForm';
import validate from '../validations';
import actions from '../actions';

class GroupEdit extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    usersActions: PropTypes.object.isRequired,
    fetchGroup: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
    unloadGroup: PropTypes.func.isRequired,
    groupPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchGroup, usersActions } = this.props;

    fetchGroup(match.params.fqon, match.params.groupId);

    usersActions.fetchUsers({ fqon: match.params.fqon });
  }

  componentWillUnmount() {
    const { unloadGroup } = this.props;

    unloadGroup();
  }

  update = (values) => {
    const { match, dispatch, reset, group, updateGroup } = this.props;
    const { name, description } = group;
    const onSuccess = () => dispatch(reset());
    const originalModel = {
      name,
      description
    };

    const model = {
      name: values.name,
      description: values.description
    };

    const patches = jsonPatch.compare(originalModel, model);
    updateGroup(match.params.fqon, group.id, patches, onSuccess);
  }

  render() {
    const { group, groupPending } = this.props;
    return (
      <div>
        {groupPending && !group.id ?
          <ActivityContainer id="group-loading" /> :
          <GroupForm
            editMode
            title={group.name}
            submitLabel="Update"
            cancelLabel="Groups"
            onSubmit={this.update}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { group } = state.metaResource.group;
  const model = {
    ...metaModels.group,
    name: group.name,
    description: group.description,
    properties: {
      users: group.properties.users
    }
  };

  return {
    group,
    users: state.metaResource.users.users.filter(val => val.name.includes(state.groups.availableUsersFilter.filterText)),
    memberUsersFilter: state.groups.memberUsersFilter,
    availableUsersFilter: state.groups.availableUsersFilter,
    initialValues: model,
  };
}

export default compose(
  withMetaResource,
  withUsers(),
  connect(mapStateToProps, actions),
  reduxForm({
    form: 'groupEdit',
    enableReinitialize: true,
    validate,
  })
)(GroupEdit);
