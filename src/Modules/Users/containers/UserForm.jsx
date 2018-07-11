import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import Form from 'components/Form';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { FullPageFooter } from 'components/FullPage';
import { Button } from 'components/Buttons';

const UserForm = ({
  editMode,
  match,
  handleSubmit,
  pristine,
  loading,
  organizations,
  submitting,
}) => (
  <Form onSubmit={handleSubmit} autoComplete="off" disabled={loading}>
    <Row gutter={5}>
      <Col flex={12}>
        <Panel expandable={false}>
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
                placeholder={editMode && 'Reset Password'}
                label={editMode ? 'Reset Password' : 'New Password'}
                type="password"
                required={!editMode}
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
                menuItems={organizations}
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

    <FullPageFooter>
      <Button
        flat
        component={Link}
        iconChildren="arrow_back"
        to={`/${match.params.fqon}/users`}
      >
        Users
      </Button>
      <Button
        raised
        iconChildren="save"
        type="submit"
        disabled={pristine || loading || submitting}
        primary
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

UserForm.propTypes = {
  match: PropTypes.object.isRequired,
  organizations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
};

UserForm.defaultProps = {
  editMode: false,
};

export default withRouter(UserForm);
