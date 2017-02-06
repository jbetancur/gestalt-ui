import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import GroupForm from '../../components/GroupForm';
import validate from '../../validations';
import * as actions from '../../actions';

class GroupCreate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    createGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchUsers(this.props.params.fqon);
  }

  create(values) {
    const { name, description } = values;
    const model = {
      name,
      description,
      properties: {}
    };

    this.props.createGroup(this.props.params.fqon, model);
  }

  render() {
    return <GroupForm title="Create Group" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  const model = {
    name: '',
    properties: {
      users: []
    }
  };

  return {
    group: model,
    users: state.groups.fetchUsers.users,
    pending: state.groups.fetchOne.pending,
    pendingUsers: state.groups.fetchUsers.pending,
    updatePending: state.groups.updateOne.pending,
    updateMembers: state.groups.groupMembers.pending,
    initialValues: model
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'groupCreate',
  validate
})(GroupCreate));
