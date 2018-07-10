import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { ActivityContainer } from 'components/ProgressIndicators';
import Form from 'components/Form';
import { SelectField, TextField } from 'components/ReduxFormFields';
import DetailsPane from 'components/DetailsPane';
import { Panel } from 'components/Panels';
import ActionsToolbar from 'components/ActionsToolbar';
import { FullPageFooter } from 'components/FullPage';
import { Button } from 'components/Buttons';

const UserForm = ({ title, submitLabel, cancelLabel, match, handleSubmit, onSubmit, pristine, history, user, userPending, allOrganizationsDropDown, submitting }) => {
  const goBack = () => {
    history.push(`/${match.params.fqon}/users`);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off" disabled={userPending}>
      <Row gutter={5} center>
        <Col flex={10} xs={12} sm={12} md={12}>
          <ActionsToolbar title={title} />
          {userPending && <ActivityContainer id="user-form" />}
          <Row gutter={5}>
            {user.id &&
              <Col flex={12}>
                <Panel title="Resource Details" defaultExpanded={false}>
                  <DetailsPane model={user} />
                </Panel>
              </Col>}

            <Col flex={12}>
              <Panel title="General" expandable={false}>
                <Row gutter={5}>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      label="Username"
                      type="text"
                      required
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="properties.password"
                      placeholder={user.id && 'Reset Password'}
                      label={user.id ? 'Reset Password' : 'New Password'}
                      type="password"
                      required={!user.id}
                      autoComplete="new-password"
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="properties.firstName"
                      label="First Name"
                      type="text"
                      required
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="properties.lastName"
                      label="Last Name"
                      type="text"
                      required
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="properties.email"
                      label="Email"
                      type="email"
                      required
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="properties.phoneNumber"
                      label="Phone Number"
                      type="text"
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      id="select-gestalt-home"
                      component={SelectField}
                      name="properties.gestalt_home"
                      menuItems={allOrganizationsDropDown}
                      required
                      itemLabel="name"
                      itemValue="value"
                      label="Gestalt Home"
                      async
                    />
                  </Col>
                  <Col flex={6} xs={12}>
                    <Field
                      component={TextField}
                      name="description"
                      label="Description"
                      type="text"
                    />
                  </Col>
                </Row>
              </Panel>
            </Col>
          </Row>
        </Col>
      </Row>

      <FullPageFooter>
        <Button
          flat
          iconChildren="arrow_back"
          disabled={userPending || submitting}
          onClick={goBack}
        >
          {cancelLabel}
        </Button>
        <Button
          raised
          iconChildren="save"
          type="submit"
          disabled={pristine || userPending || submitting}
          primary
        >
          {submitLabel}
        </Button>
      </FullPageFooter>
    </Form>
  );
};

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  allOrganizationsDropDown: PropTypes.array.isRequired,
  userPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};

UserForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default UserForm;
