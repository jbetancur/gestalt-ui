import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Link } from 'react-router-dom';
import { Field } from 'react-final-form';
import { FullPageFooter } from 'components/FullPage';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import Form from 'components/Form';

const APIForm = ({
  match,
  apiPending,
  pristine,
  submitting,
  handleSubmit,
  editMode,
  providerKongsByGatewayData,
}) => (
  <Form onSubmit={handleSubmit} autoComplete="off" disabled={apiPending}>
    <Row gutter={5}>
      <Col flex={12}>
        <Panel title="General" expandable={false}>
          <Row gutter={5}>
            <Col flex={6} xs={12}>
              <Field
                id="select-provider"
                component={SelectField}
                name="properties.provider.locations"
                required
                label="Provider"
                itemLabel="name"
                itemValue="id"
                menuItems={providerKongsByGatewayData}
                async
                disabled={editMode}
              />
            </Col>
            <Col flex={6} xs={12}>
              <Field
                component={TextField}
                name="name"
                label="Name"
                type="text"
                required
                disabled={editMode}
              />
            </Col>

            <Col flex={12}>
              <Field
                id="description"
                component={TextField}
                name="description"
                label="Description"
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
        disabled={apiPending || submitting}
        component={Link}
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/apis`}
      >
        APIs
      </Button>
      <Button
        raised
        iconChildren="save"
        type="submit"
        disabled={pristine || apiPending || submitting}
        primary
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

APIForm.propTypes = {
  // values: PropTypes.object.isRequired,
  providerKongsByGatewayData: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  apiPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
};

APIForm.defaultProps = {
  editMode: false,
};

// Connect to this forms state in the store so we can enum the values
export default APIForm;

