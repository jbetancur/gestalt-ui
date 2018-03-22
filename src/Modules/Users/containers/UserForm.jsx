import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle, CardText } from 'react-md';
import { LinearProgress } from 'components/ProgressIndicators';
import { SelectField, TextField } from 'components/ReduxFormFields';
import ActionsToolbar from 'components/ActionsToolbar';
import { Button } from 'components/Buttons';
import PreventAutoFill from 'components/PreventAutoFill';

const UserForm = (props) => {
  const goBack = () => {
    props.history.push(`/${props.match.params.fqon}/users`);
  };

  return (
    <div>
      <form onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <Row gutter={5} center>
          <Col component={Card} flex={10} xs={12} sm={12} md={12}>
            <CardTitle title={props.title} />
            <ActionsToolbar>
              <Button
                flat
                iconChildren="arrow_back"
                disabled={props.userPending || props.submitting}
                onClick={goBack}
              >
                {props.cancelLabel}
              </Button>
              <Button
                raised
                iconChildren="save"
                type="submit"
                disabled={props.pristine || props.userPending || props.userUpdatePending || props.invalid || props.submitting}
                primary
              >
                {props.submitLabel}
              </Button>
            </ActionsToolbar>
            {(props.userUpdatePending || props.userPending) && <LinearProgress id="user-form" />}
            <CardText>
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
                  <PreventAutoFill />
                  <Field
                    component={TextField}
                    name="properties.password"
                    placeholder={props.user.id && 'Reset Password'}
                    label={props.user.id ? 'Reset Password' : 'New Password'}
                    type="password"
                    required={!props.user.id}
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
                    menuItems={props.allOrganizationsDropDown}
                    required
                    itemLabel="name"
                    itemValue="value"
                    label="Gestalt Home"
                    async
                    onFocus={() => props.fetchAllOrgsDropDown(props.match.params.fqon)}
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
            </CardText>
          </Col>
        </Row>
      </form>
    </div>
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
  fetchAllOrgsDropDown: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  userUpdatePending: PropTypes.bool,
};

UserForm.defaultProps = {
  userUpdatePending: false,
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
};

export default UserForm;
