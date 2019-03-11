import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
import { Row, Col } from 'react-flexybox';
// import { withContext } from 'Modules/Hierarchy';
import ActionsToolbar from 'components/ActionsToolbar';
import { ActivityContainer } from 'components/ProgressIndicators';
import UserForm from './UserForm';
import validate from '../validations';
import userModel from '../models/user';
import withContext from '../../Hierarchy/hocs/withContext';
import withUser from '../hocs/withUser';
import withUsers from '../hocs/withUsers';

const initialValues = userModel.create();

class UserCreate extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    userPending: PropTypes.bool.isRequired,
    userActions: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, hierarchyContextActions } = this.props;

    hierarchyContextActions.fetchAllOrgsDropDown({ fqon: match.params.fqon });
  }

  create = (values) => {
    const { history, match, userActions } = this.props;
    const onSuccess = response => history.replace(`/${match.params.fqon}/users/${response.id}`);

    userActions.createUser({ fqon: match.params.fqon, payload: values, onSuccess });
  }

  render() {
    const { match, userPending, hierarchyContext: { allOrganizationsDropDown } } = this.props;

    return (
      <Row center>
        <Col flex={8} xs={12} sm={12} md={12}>
          <ActionsToolbar title="Create a User" />

          {userPending && <ActivityContainer id="user-loading" />}

          <FinalForm
            onSubmit={this.create}
            initialValues={initialValues}
            validate={validate()}
            organizations={allOrganizationsDropDown}
            render={({ handleSubmit, submitting, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                disabled={userPending}
                disabledSubmit={userPending || submitting}
                submitTitle="Create"
                showCancel
                cancelTo={`/${match.params.fqon}/users`}
              >
                <UserForm {...rest} />
              </Form>
            )}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withContext(),
  withUser(),
  withUsers(),
)(UserCreate);
