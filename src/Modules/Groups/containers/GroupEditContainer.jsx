import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext, Breadcrumbs, ContextNavigation } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import ActivityContainer from 'components/ActivityContainer';
import jsonPatch from 'fast-json-patch';
import GroupForm from '../components/GroupForm';
import validate from '../validations';
import actions from '../actions';

class GroupEdit extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    fetchGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
    groupPending: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { match, fetchGroup, fetchUsers } = this.props;
    fetchGroup(match.params.fqon, match.params.groupId);
    fetchUsers(match.params.fqon);
  }

  update(values) {
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
    const { group, groupPending, pristine } = this.props;
    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        {groupPending && !group.id ?
          <ActivityContainer id="group-loading" /> :
          <GroupForm
            editMode
            title={group.name}
            submitLabel="Update"
            cancelLabel={pristine ? 'Back' : 'Cancel'}
            onSubmit={values => this.update(values)}
            {...this.props}
          />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { group } = state.metaResource.group;

  return {
    group,
    users: state.metaResource.users.users.filter(val => val.name.includes(state.groups.availableUsersFilter.filterText)),
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'groupEdit',
  validate
})(withContext(GroupEdit))));
