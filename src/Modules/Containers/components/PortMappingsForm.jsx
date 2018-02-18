import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField, Checkbox } from 'components/ReduxFormFields';
import { Button } from 'components/Buttons';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';
import { Subtitle } from 'components/Typography';
import networkProtocols from '../lists/networkProtocols';
import { portMappingServiceNameMaxLen } from '../validations';

const fixInputNumber = value => value && parseInt(value, 10);
const initialValues = {
  protocol: 'tcp',
  expose_endpoint: true,
  service_port: 0,
};

const PortMappingsForm = ({ fields, networkType, portMappingFormValues }) => (
  <FieldContainer>
    <FieldItem>
      <Button
        flat
        primary
        iconChildren="add"
        onClick={() => fields.push(initialValues)}
      >
        Service Mapping
      </Button>
    </FieldItem>
    {fields.map((member, index) => {
      const field = portMappingFormValues[index];

      return (
        <FieldItem key={`portmapping-${index}`}>
          <RemoveButton onRemove={fields.remove} index={index} tabIndex="-1" />
          <Subtitle>Mapping {index + 1}</Subtitle>
          <Row gutter={5}>
            <Col flex={1} xs={12} sm={12} md={12} style={{ minWidth: '90px' }}>
              <Field
                id={`${member}.expose_endpoint`}
                name={`${member}.expose_endpoint`}
                component={Checkbox}
                checked={field.expose_endpoint}
                label="Enable"
              />
            </Col>
            <Col flex={2} xs={12} sm={12} md={6}>
              <Field
                name={`${member}.name`}
                type="text"
                component={TextField}
                label="Service Name"
                maxLength={portMappingServiceNameMaxLen}
                required
              />
            </Col>
            {(networkType !== 'HOST') &&
              <Col flex={2} xs={12} sm={12} minWidth={100}>
                <Field
                  name={`${member}.container_port`}
                  type="number"
                  min={0}
                  max={65535}
                  label="Container Port"
                  component={TextField}
                  required
                  normalize={fixInputNumber}
                />
              </Col>}
            {field.expose_endpoint &&
              <Col flex={2} xs={12} sm={12}>
                <Field
                  name={`${member}.service_port`}
                  type="number"
                  min={0}
                  max={65535}
                  label="Service Port"
                  component={TextField}
                  required
                  normalize={fixInputNumber}
                  helpText="0=auto-assign"
                />
              </Col>}
            <Col flex={1} xs={12} sm={12} md={2}>
              <Field
                id={`${member}.protocol`}
                name={`${member}.protocol`}
                component={SelectField}
                label="Protocol"
                itemLabel="displayName"
                itemValue="value"
                menuItems={networkProtocols}
                required
              />
            </Col>
            {field.expose_endpoint &&
            <Col flex>
              <Field
                name={`${member}.virtual_hosts`}
                component={TextField}
                label="Virtual Hosts"
                helpText="comma delimited set of virtual host names or addresses"
              />
            </Col>}
          </Row>
        </FieldItem>
      );
    })}
  </FieldContainer>
);

PortMappingsForm.propTypes = {
  fields: PropTypes.object.isRequired,
  networkType: PropTypes.string.isRequired,
  portMappingFormValues: PropTypes.array.isRequired,
};

export default PortMappingsForm;
