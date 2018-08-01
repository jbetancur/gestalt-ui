import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField, Checkbox } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { Chips } from 'components/Lists';
import networkProtocols from '../lists/networkProtocols';
import exposureTypes from '../lists/exposureTypes';

const fixInputNumber = value => value && parseInt(value, 10);
const initialValues = {
  type: 'internal',
  protocol: 'tcp',
  expose_endpoint: true,
};

const PortMappingsForm = ({ fields, networkType, portMappingFormValues, change }) => (
  <FieldContainer>
    <AddButton label="Add Mapping" onClick={() => fields.unshift(initialValues)} />
    {fields.map((member, index) => {
      const field = portMappingFormValues[index];
      const handleLBPort = (dummy, value) => {
        if (field.expose_endpoint) {
          change(`${member}.lb_port`, value);
        }
      };

      return (
        <FieldItem key={`portmapping-${member}`}>
          <Row gutter={5} alignItems="baseline" columnDivisions={24}>
            <Col flex={2} xs={24} sm={24} md={24} style={{ minWidth: '90px' }}>
              <Field
                id={`${member}.expose_endpoint`}
                name={`${member}.expose_endpoint`}
                component={Checkbox}
                checked={field.expose_endpoint}
                label="Expose Service"
              />
            </Col>
            {field.expose_endpoint &&
              <Col flex={3} xs={24} sm={24} md={4}>
                <Field
                  id={`${member}.type`}
                  name={`${member}.type`}
                  component={SelectField}
                  label="Exposure Type"
                  itemLabel="displayName"
                  itemValue="value"
                  menuItems={exposureTypes}
                  sameWidth={false}
                  required
                />
              </Col>}
            <Col flex={2} xs={24} sm={8} md={4}>
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
            <Col flex={3} xs={24} sm={24} md={12}>
              <Field
                name={`${member}.name`}
                type="text"
                component={TextField}
                label="Service Label"
                required
              />
            </Col>
            {(networkType !== 'HOST') &&
              <Col flex={3} xs={24} sm={8}>
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
              <Col flex={3} xs={24} sm={8}>
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
            {field.expose_endpoint &&
            <Col flex>
              <Field
                label="Hostname"
                addLabel="Add Host"
                component={Chips}
                name={`${member}.virtual_hosts`}
                ignorePrefixValidation
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
