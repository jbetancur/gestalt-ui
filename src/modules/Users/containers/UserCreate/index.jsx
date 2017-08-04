import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { withContext, Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import UserForm from '../../components/UserForm';
import validate from '../../validations';
import actions from '../../actions';

class UserCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    createUser: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
  };

  create(values) {
    const { history, match, createUser } = this.props;
    const onSuccess = () => history.replace(`/${match.params.fqon}/users`);

    createUser(match.params.fqon, values, onSuccess);
  }

  render() {
    return (
      <div>
        <ContextNavigation
          breadcrumbComponent={<Breadcrumbs />}
        />
        <UserForm
          title="Create User"
          submitLabel="Create"
          cancelLabel={this.props.pristine ? 'Back' : 'Cancel'}
          onSubmit={values => this.create(values)}
          {...this.props}
        />
      </div>
    );
  }
}

function mapStateToProps() {
  const model = {
    name: '',
    properties: {
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gestalt_home: ''
    }
  };

  return {
    user: model,
    initialValues: model
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(reduxForm({
  form: 'userCreate',
  validate
})(withContext(UserCreate))));
