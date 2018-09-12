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
import { composeValidators, required } from 'util/forms';

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
      <Col flex={7} xs={12} sm={12}>
        <Panel title="General" expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="name"
                component={TextField}
                name="name"
                label="Policy Name"
                validate={composeValidators(required('policy name is required'))}
                required
              />
            </Col>
          </Row>
        </Panel>
      </Col>

      <Col flex={5} xs={12} sm={12}>
        <Panel title="Description" expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="description"
                component={TextField}
                name="description"
                placeholder="Description"
                rows={1}
                maxRows={6}
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
