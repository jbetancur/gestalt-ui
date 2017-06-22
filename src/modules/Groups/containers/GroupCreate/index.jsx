import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import GroupForm from '../../components/GroupForm';
import validate from '../../validations';
import actions from '../../actions';

class GroupCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchUsers(this.props.match.params.fqon);
  }

  create(values) {
    const { match, history, createGroup } = this.props;
    const { name, description } = values;
    const payload = {
      name,
      description,
      properties: {},
    };

    const onSuccess = response => history.replace(`/${match.params.fqon}/groups/${response.id}/edit`);

    createGroup(match.params.fqon, payload, onSuccess);
  }

  render() {
    return <GroupForm title="Create Team" submitLabel="Create" cancelLabel="Cancel" onSubmit={values => this.create(values)} {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    group: state.metaResource.group.group,
    users: state.metaResource.users.users,
    pending: state.metaResource.group.pending,
    pendingUsers: state.metaResource.users.pending,
    updatePending: state.metaResource.groupUpdate.pending,
    updateMembers: state.metaResource.groupMembers.pending,
    initialValues: state.metaResource.group.group,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(reduxForm({
  form: 'groupCreate',
  validate
})(context(GroupCreate)));
