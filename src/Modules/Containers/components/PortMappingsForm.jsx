import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField, Checkbox } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import networkProtocols from '../lists/networkProtocols';
import { portMappingServiceNameMaxLen } from '../validations';

const fixInputNumber = value => value && parseInt(value, 10);
const initialValues = {
  protocol: 'tcp',
  expose_endpoint: true,
};

const PortMappingsForm = ({ fields, networkType, portMappingFormValues, change }) => (
  <FieldContainer>
    <FieldItem>
      <AddButton label="Add Mapping" onAddItem={() => fields.unshift(initialValues)} />
    </FieldItem>
    {fields.map((member, index) => {
      const field = portMappingFormValues[index];
      const handleLBPort = (dummy, value) => {
        if (field.expose_endpoint) {
          change(`${member}.lb_port`, value);
        }
      };

      return (
        <FieldItem key={`portmapping-${member}`}>
          <Row gutter={5}>
            <Col flex={1} xs={12} sm={12} md={12} style={{ minWidth: '90px' }}>
              <Field
                id={`${member}.expose_endpoint`}
                name={`${member}.expose_endpoint`}
                component={Checkbox}
                checked={field.expose_endpoint}
                label="Expose Service"
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
                  onChange={handleLBPort}
                />
              </Col>}
            {field.expose_endpoint &&
              <Col flex={2} xs={12} sm={12}>
                <Field
                  name={`${member}.lb_port`}
                  type="number"
                  min={0}
                  max={65535}
                  label="Load Balancer Port"
                  component={TextField}
                  required
                  normalize={fixInputNumber}
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
          <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
        </FieldItem>
      );
    })}
  </FieldContainer>
);

PortMappingsForm.propTypes = {
  fields: PropTypes.object.isRequired,
  networkType: PropTypes.string.isRequired,
  portMappingFormValues: PropTypes.array.isRequired,
  change: PropTypes.func.isRequired,
};

export default PortMappingsForm;
