import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { getIn } from 'final-form';
import { SelectField, TextField, Checkbox } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { Chips } from 'components/Lists';
import { fixInputNumber, composeValidators, required, min, max, maxLen, formatName } from 'util/forms';
import networkProtocols from '../lists/networkProtocols';
import exposureTypes from '../lists/exposureTypes';

const initialValues = {
  type: 'internal',
  protocol: 'tcp',
  expose_endpoint: true,
};

class PortMappingsForm extends Component {
  handleLBPort = (field, index) => (value) => {
    const { form, fieldName } = this.props;
    const item = { ...field };
    const port = fixInputNumber(value);

    if (field.expose_endpoint) {
      item.lb_port = port;
    }

    form.batch(() => {
      form.change(`${fieldName}[${index}].container_port`, port);
      form.change(`${fieldName}[${index}].lb_port`, port);
    });
  };

  render() {
    const { fieldName, formValues, networkType } = this.props;

    return (
      <FieldArray name={fieldName}>
        {({ fields }) => (
          <FieldContainer>
            <AddButton label="Add Mapping" onClick={() => fields.unshift(initialValues)} />
            {fields.map((member, index) => {
              const field = getIn(formValues, member) || {};

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
                          validate={composeValidators(required())}
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
                      />
                    </Col>
                    <Col flex={3} xs={24} sm={24} md={12}>
                      <Field
                        name={`${member}.name`}
                        type="text"
                        component={TextField}
                        label="Service Label"
                        validate={composeValidators(required(), maxLen(15))}
                        parse={formatName}
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
                          validate={composeValidators(required(), min(0), max(65536))}
                          parse={fixInputNumber}
                          onChange={this.handleLBPort(field, index)}
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
                          validate={composeValidators(required(), min(0), max(65536))}
                          parse={fixInputNumber}
                        />
                      </Col>}
                    {field.expose_endpoint &&
                      <Col flex>
                        <Field
                          id={`${member}-hostnames`}
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
        )}
      </FieldArray>
    );
  }
}

PortMappingsForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired,
  formValues: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default PortMappingsForm;
