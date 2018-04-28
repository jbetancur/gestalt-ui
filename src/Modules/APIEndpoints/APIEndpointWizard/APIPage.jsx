import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Col, Row } from 'react-flexybox';
import { SelectField } from 'components/ReduxFormFields';

const APIPage = ({ apis }) => (
  <Row gutter={5} center>
    <Col flex={6} xs={12}>
      <Field
        id="wizard--select-api"
        name="apiId"
        type="text"
        component={SelectField}
        menuItems={apis.length ? apis : [{ id: null, name: 'No Avalable APIs' }]}
        itemLabel="name"
        itemValue="id"
        label="API"
        helpText="Select an API"
        async
        required
        simplifiedMenu={false}
        repositionOnScroll={false}
      />
    </Col>
  </Row>
);

APIPage.propTypes = {
  apis: PropTypes.array,
};

APIPage.defaultProps = {
  apis: [],
};

export default APIPage;
