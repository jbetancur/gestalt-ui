import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext, Breadcrumbs, ContextNavigation } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import GroupForm from '../../components/GroupForm';
import validate from '../../validations';
import actions from '../../actions';

class GroupCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createGroup: PropTypes.func.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
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

    const onSuccess = response => history.replace(`/${match.params.fqon}/hierarchy/groups/${response.id}/edit`);

    createGroup(match.params.fqon, payload, onSuccess);
  }

  render() {
    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        <GroupForm
          title="Create Group"
          submitLabel="Create"
          cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
          onSubmit={values => this.create(values)}
          {...this.props}
        />
      </div>
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
})(withContext(GroupCreate))));
