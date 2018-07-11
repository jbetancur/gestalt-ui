import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Panel } from 'components/Panels';
import { FullPageFooter } from 'components/FullPage';
import { TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import Form from 'components/Form';

const GroupForm = ({
  match,
  editMode,
  pristine,
  loading,
  submitting,
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit} autoComplete="off" disabled={loading}>
    <Row gutter={5}>
      <Col flex={12}>
        <Panel expandable={false}>
          <Row gutter={5}>
            <Col flex={4} xs={12}>
              <Field
                component={TextField}
                name="name"
                label="Name"
                type="text"
                required
              />
            </Col>
            <Col flex={8} xs={12}>
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
        iconChildren="arrow_back"
        component={Link}
        to={`/${match.params.fqon}/groups`}
      >
        Groups
      </Button>
      <Button
        raised
        iconChildren="save"
        type="submit"
        disabled={pristine || loading || loading || submitting}
        primary
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

GroupForm.propTypes = {
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
};

GroupForm.defaultProps = {
  editMode: false,
};

export default withRouter(GroupForm);
