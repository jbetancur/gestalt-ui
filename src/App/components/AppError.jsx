import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Button } from 'components/Buttons';

const AppError = props => (
  <Row center fill style={{ textAlign: 'center' }}>
    <Col flex={8}>
      <h1>
        There was an issue connecting to the Gestalt API. If a page refresh does not solve the issue please contact your Gestalt admin.
      </h1>
      <Button primary raised onClick={props.onLogout}>Logout</Button>
    </Col>
  </Row>
);

AppError.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AppError;
