import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField } from 'components/ReduxFormFields';
import { FieldContainer, FieldItem, RemoveButton, AddButton } from 'components/FieldArrays';
import { composeValidators, required } from 'util/forms';

const initialValues = {
  meta_function: 'default',
};

const MatchActionsForm = memo(({ fieldName, actions, disableBehavior }) => (
  <FieldArray name={fieldName}>
    {({ fields }) => (
      <FieldContainer>
        {fields.map((member, index) => (
          <FieldItem key={`label-${member}`}>
            <Row gutter={5}>
              <Col flex>
                <Field
                  label="Event"
                  name={`${member}.action`}
                  menuItems={actions}
                  component={SelectField}
                  validate={composeValidators(required())}
                />
              </Col>
              {!disableBehavior &&
                <Col flex={2} xs={12} sm={12}>
                  <Field
                    label="Behavior"
                    name={`${member}.meta_function`}
                    placeholder="value"
                    menuItems={['default', 'suppress']}
                    component={SelectField}
                  />
                </Col>}
            </Row>
            <RemoveButton onRemove={fields.remove} fieldIndex={index} tabIndex="-1" />
          </FieldItem>
        ))}
        <Row gutter={5} center>
          <Col flex={12}>
            <AddButton label="Add Event" onClick={() => fields.push(initialValues)} />
          </Col>
        </Row>
      </FieldContainer>
    )}
  </FieldArray>
));

MatchActionsForm.propTypes = {
  fieldName: PropTypes.string.isRequired,
  actions: PropTypes.array.isRequired,
  disableBehavior: PropTypes.bool
};

MatchActionsForm.defaultProps = {
  disableBehavior: false,
};

export default MatchActionsForm;
