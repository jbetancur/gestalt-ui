import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field } from 'react-final-form';
import { FullPageFooter } from 'components/FullPage';
import { Button } from 'components/Buttons';
import { TextField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import Form from 'components/Form';

const PolicyForm = ({
  match,
  policyPending,
  pristine,
  submitting,
  handleSubmit,
  editMode,
}) => (
  <Form onSubmit={handleSubmit} autoComplete="off" disabled={policyPending}>
    <Row gutter={5}>
      <Col flex={12}>
        <Panel title="General" expandable={false}>
          <Row gutter={5}>
            <Col flex={5} xs={12}>
              <Field
                component={TextField}
                name="name"
                label="Name"
                type="text"
                required
                autoComplete="none"
              />
            </Col>

            <Col flex={12}>
              <Field
                id="description"
                component={TextField}
                name="description"
                label="Description"
                type="text"
                rows={1}
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
        disabled={policyPending || submitting}
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/policies`}
      >
        Policies
      </Button>
      <Button
        raised
        iconChildren="save"
        type="submit"
        disabled={pristine || policyPending || submitting}
        primary
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

PolicyForm.propTypes = {
  match: PropTypes.object.isRequired,
  policyPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
};

PolicyForm.defaultProps = {
  editMode: false,
};

export default PolicyForm;
