import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { withOrganizations, withUser, withUsers, metaModels } from 'Modules/MetaResource';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import UserForm from './UserForm';
import validate from '../validations';
import actions from '../actions';

const initialValues = metaModels.user.create();

class UserCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    userPending: PropTypes.bool.isRequired,
    userActions: PropTypes.object.isRequired,
    allOrganizationsDropDown: PropTypes.array.isRequired,
    organizationsActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, organizationsActions } = this.props;

    organizationsActions.fetchAllOrgsDropDown({ fqon: match.params.fqon });
  }

  create = (values) => {
    const { history, match, userActions } = this.props;
    const onSuccess = () => history.replace(`/${match.params.fqon}/users`);

    userActions.createUser({ fqon: match.params.fqon, payload: values, onSuccess });
  }

  render() {
    const { userPending, allOrganizationsDropDown } = this.props;

    return (
      <Row center>
        <Col flex={8} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a User" />
          {userPending && <ActivityContainer id="user-loading" />}
          <Form
            render={UserForm}
            onSubmit={this.create}
            initialValues={initialValues}
            validate={validate()}
            loading={userPending}
            organizations={allOrganizationsDropDown}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withOrganizations(),
  withUser(),
  withUsers(),
  connect(null, actions),
)(UserCreate);
