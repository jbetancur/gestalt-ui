import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import Form from 'components/Form';
// import { withContext } from 'Modules/Hierarchy';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import ActionsToolbar from 'components/ActionsToolbar';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import jsonPatch from 'fast-json-patch';
import UserForm from './UserForm';
import validate from '../validations';
import actions from '../actions';
import { getEditUserModel } from '../selectors';
import withContext from '../../Hierarchy/hocs/withContext';
import withUser from '../hocs/withUser';

class GroupEdit extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    initialFormValues: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    userPending: PropTypes.bool.isRequired,
    userActions: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, userActions, hierarchyContextActions } = this.props;

    hierarchyContextActions.fetchAllOrgsDropDown({ fqon: match.params.fqon });
    userActions.fetchUser({ fqon: match.params.fqon, id: match.params.userId });
  }

  update = (values) => {
    const { match, user, userActions } = this.props;
    const { name, description, properties: { password, firstName, lastName, phoneNumber, email, gestalt_home } } = user;
    const originalModel = {
      name,
      description,
      properties: {
        password,
        firstName,
        lastName,
        phoneNumber,
        email,
        gestalt_home
      }
    };

    // Clear the password from the payload if its undefined
    if (user.id && !values.properties.password) {
      delete originalModel.properties.password;
    }

    const payload = jsonPatch.compare(originalModel, values);

    userActions.updateUser({ fqon: match.params.fqon, id: user.id, payload });
  }

  render() {
    const { match, user, userPending, initialFormValues, hierarchyContext: { allOrganizationsDropDown } } = this.props;

    if (userPending && !user.id) {
      return <ActivityContainer id="user-load" />;
    }
    return (
      <Row center>
        <Col flex={8} xs={12} sm={12} md={12}>
          <ActionsToolbar
            title={user.name}
            sticky
            showBackNav
            navTo={`/${match.params.fqon}/users`}
          />

          {userPending && <ActivityContainer id="user-loading" />}

          <Row gutter={5}>
            <Col flex={12}>
              <Panel title="Resource Details" defaultExpanded={false}>
                <DetailsPane model={user} />
              </Panel>
            </Col>
          </Row>

          <FinalForm
            editMode
            onSubmit={this.update}
            initialValues={initialFormValues}
            validate={validate(true)}
            loading={userPending}
            organizations={allOrganizationsDropDown}
            render={({ handleSubmit, submitting, pristine, ...rest }) => (
              <Form
                onSubmit={handleSubmit}
                submitTitle="Update"
                disabled={userPending}
                disabledSubmit={userPending || submitting}
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

const mapStateToProps = state => ({
  initialFormValues: getEditUserModel(state),
});

export default compose(
  withUser(),
  withContext(),
  connect(mapStateToProps, actions),
)(GroupEdit);
