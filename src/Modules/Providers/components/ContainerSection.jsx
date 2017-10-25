import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Card, CardTitle } from 'react-md';
import { ContainerCreate } from 'Modules/Containers';

const ContainerSection = props => (
  <Row gutter={5}>
    <Col flex={12}>
      <Card title="Container">
        <CardTitle
          title="Container"
          subtitle={`The provider type: ${props.name} requires a container`}
        />
        <ContainerCreate match={props.match} inlineMode />
      </Card>
    </Col>
  </Row>
);

ContainerSection.propTypes = {
  name: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
};

export default ContainerSection;
