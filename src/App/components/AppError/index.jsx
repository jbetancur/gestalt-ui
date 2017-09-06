import React from 'react';
import { Row, Col } from 'react-flexybox';

const AppError = () => (
  <Row justifyContent="center" alignItems="center" style={{ height: '100%' }}>
    <Col flex={8}>
      <h1>
        There was an issue connecting to the Gestalt API. If a page refresh does not solve the issue please contact your Gestalt admin.
      </h1>
    </Col>
  </Row>
);

export default AppError;
