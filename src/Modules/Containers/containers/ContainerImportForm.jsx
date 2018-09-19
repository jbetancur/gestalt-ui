import React from 'react';
import PropTypes from 'prop-types';
import Form from 'components/Form';
import { Row, Col } from 'react-flexybox';
import { Field } from 'react-final-form';
import { composeValidators, required } from 'util/forms';
import { SelectField, TextField } from 'components/ReduxFormFields';

const ContainerImportForm = ({ handleSubmit, providers, pending }) => (
  <Form id="import-container-modal" onSubmit={handleSubmit} disabled={pending}>
    <Row gutter={5}>
      <Col flex={12}>
        <Field
          component={TextField}
          name="name"
          label="Container Name"
          type="text"
          required
          validate={composeValidators(required())}
        />
      </Col>
      <Col flex={12}>
        <Field
          id="import-provider"
          component={SelectField}
          name="properties.provider.id"
          required
          label="CaaS Provider"
          itemLabel="name"
          itemValue="id"
          menuItems={providers}
          simplifiedMenu={false}
          async
          validate={composeValidators(required())}
        />
      </Col>
      <Col flex={12}>
        <Field
          component={TextField}
          name="properties.external_id"
          label="External Id"
          type="text"
          required
          validate={composeValidators(required())}
          helpText='For DC/OS, this is the "appId" of the Marathon application. For Kubernetes this is the "/namespace/resource-name"'
        />
      </Col>
    </Row>
  </Form>
);

ContainerImportForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  providers: PropTypes.array.isRequired,
  pending: PropTypes.bool.isRequired,
};

export default ContainerImportForm;
