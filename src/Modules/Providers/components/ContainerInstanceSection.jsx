import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import { Card } from 'react-md';
import { parseChildClass } from 'util/helpers/strings';
import { ContainerInstances, ContainerServiceAddresses } from 'Modules/Containers';

const ContainerInstanceSection = props => (
  <Row gutter={5} center>
    <Col
      flex={12}
      xs={12}
      sm={12}
      md={12}
    >
      <Card>
        <ContainerInstances
          containerModel={props.container}
          match={props.match}
          providerType={parseChildClass(props.provider.resource_type)}
        />
      </Card>
    </Col>

    <Col
      flex={12}
      xs={12}
      sm={12}
      md={12}
    >
      <Card>
        <ContainerServiceAddresses
          containerModel={props.container}
          match={props.match}
        />
      </Card>
    </Col>
  </Row>
);

ContainerInstanceSection.propTypes = {
  container: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default ContainerInstanceSection;
