import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { Col, Row } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { SelectField as MDSelectField } from 'react-md';
import { Button } from 'components/Buttons';
import { Panel } from 'components/Panels';
import Fieldset from 'components/Fieldset';
import { ListTable } from 'components/Lists';
import { FieldContainer, FieldItem, RemoveButton } from 'components/FieldArrays';
import PreventAutoFill from 'components/PreventAutoFill';

const ActionsMappingForm = ({ fields, lambdas, values }) => {
  const supportedResources = values.map(v => ({ name: v.properties.actions.prefix }));

  return (
    <FieldContainer>
      <FieldItem>
        <Button
          flat
          primary
          iconChildren="add"
          onClick={() => fields.push({ kind: 'http', authentication: { kind: 'Basic' } })}
        >
          Action Mapping
        </Button>
      </FieldItem>
      {fields.map((member, index) => (
        <Panel title={`Action ${index + 1}`} noPadding>
          <FieldItem key={index}>
            <RemoveButton onRemove={fields.remove} index={index} />
            <Row gutter={5}>
              <Col flex={12}>
                <Row gutter={5}>
                  <Col flex={6}>
                    <Field
                      id="select-actions"
                      component={SelectField}
                      name={`${member}.prefix`}
                      itemLabel="name"
                      itemValue="name"
                      menuItems={supportedResources}
                      label="Select a Prefix"
                      helpText="A prefix maps to a specific lambda"
                      required
                    />
                  </Col>
                  <Col flex={2}>
                    <MDSelectField
                      id="select-implementaion-mapping"
                      menuItems={['Lambda']}
                      defaultValue="Lambda"
                      label="Implementation"
                      lineDirection="center"
                      fullWidth
                      required
                    />
                  </Col>
                  <Col flex={4}>
                    <Field
                      id="select-lambda-mapping"
                      component={SelectField}
                      name={`${member}.implementation.id`}
                      menuItems={lambdas}
                      itemLabel="name"
                      itemValue="id"
                      label="Lambda"
                      helpText="Lambda to Map"
                      required
                    />
                  </Col>

                  <Col flex={6}>
                    <Fieldset legend="Action Verbs">
                      <Field
                        component={ListTable}
                        prefix={fields.get(index).prefix}
                        name={`${member}.actions`}
                      />
                    </Fieldset>
                  </Col>

                  <Col flex={6}>
                    <Fieldset legend="Authorization">
                      <Row gutter={5}>
                        {/* <Col flex={6}>
                          <Field
                            id="select-kind"
                            component={SelectField}
                            name={`${member}.kind`}
                            menuItems={['http']}
                            label="Type"
                          />
                        </Col> */}
                        <Col flex={4}>
                          <Field
                            id="select-auth-kind"
                            component={SelectField}
                            name={`${member}.authentication.kind`}
                            menuItems={['Basic']}
                            label="Type"
                          />
                        </Col>
                        <Col flex={4}>
                          <Field
                            component={TextField}
                            name={`${member}.authentication.username`}
                            label="Username"
                          />
                        </Col>
                        <Col flex={4}>
                          <PreventAutoFill />
                          <Field
                            component={TextField}
                            type="password"
                            name={`${member}.authentication.password`}
                            label="Password"
                          />
                        </Col>
                      </Row>
                    </Fieldset>
                  </Col>
                </Row>
              </Col>
            </Row>
          </FieldItem>
        </Panel>
      ))}
    </FieldContainer>
  );
};

ActionsMappingForm.propTypes = {
  fields: PropTypes.object.isRequired,
  lambdas: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
};

ActionsMappingForm.defaultProps = {
  lambdas: [],
  supportedResources: [],
};

const selector = form => formValueSelector(form);

export default connect(
  state => ({
    values: selector('ServiceModelerWizard')(state,
      'properties.supported_resources',
    ),
  }),
)(ActionsMappingForm);
