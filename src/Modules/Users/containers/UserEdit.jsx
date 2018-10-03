import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
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
    allOrganizationsDropDown: PropTypes.array.isRequired,
    contextActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, userActions, contextActions } = this.props;

    contextActions.fetchAllOrgsDropDown({ fqon: match.params.fqon });
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
    const { user, userPending, initialFormValues, allOrganizationsDropDown } = this.props;

    return (
      userPending && !user.id ?
        <ActivityContainer id="user-load" /> :
        <Row center>
          <Col flex={8} xs={12} sm={12} md={12}>
            <ActionsToolbar title={user.name} />
            {userPending && <ActivityContainer id="user-loading" />}
            <Row gutter={5}>
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={user} />
                </Panel>
              </Col>
            </Row>

            <Form
              editMode
              render={UserForm}
              onSubmit={this.update}
              initialValues={initialFormValues}
              validate={validate(true)}
              loading={userPending}
              organizations={allOrganizationsDropDown}
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
