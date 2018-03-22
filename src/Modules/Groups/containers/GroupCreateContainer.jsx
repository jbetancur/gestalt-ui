import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withMetaResource } from 'Modules/MetaResource';
import GroupForm from './GroupForm';
import validate from '../validations';
import actions from '../actions';

class GroupCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
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

    const onSuccess = response => history.replace(`/${match.params.fqon}/groups/${response.id}`);

    createGroup(match.params.fqon, payload, onSuccess);
  }

  render() {
    return (
      <GroupForm
        title="Create Group"
        submitLabel="Create"
        cancelLabel="Groups"
        onSubmit={values => this.create(values)}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    initialValues: state.metaResource.group.group,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'groupCreate',
  validate
})(GroupCreate)));
