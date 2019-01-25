import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { LambdaIcon } from 'components/Icons';
import { Autocomplete, FontIcon } from 'react-md';
import { Panel } from 'components/Panels';
import { TextField } from 'components/ReduxFormFields';
import { composeValidators, validator, required } from 'util/forms';
import { isUUID } from 'validator';
import policyResourceTypes from '../lists/policyResourceTypes';
import SelectionControlCheckboxes from './SelectionCheckboxes';

const policyTriggers = []
  .concat(...Object.keys(policyResourceTypes)
    .map(key => policyResourceTypes[key].triggers)
    .flatMap(trigger => trigger.map(item => item.name)));

const validateUUID = (value) => {
  // TODO: temporary until we get better lambda search
  if (typeof value === 'object') {
    if (!isUUID(value.id)) {
      return false;
    }
  }

  if (!isUUID(value)) {
    return false;
  }

  return true;
};

const PolicyEventRuleForm = ({
  form,
  values,
  editMode,
  onClickLambdasDropDown,
  lambdas,
}) => {
  const handleAutoComplete = (value) => {
    const field = editMode ? 'properties.lambda.id' : 'properties.lambda';

    form.change(field, value);
  };

  const handleItemsSelected = (items) => {
    form.change('properties.match_actions', items);
  };

  return (
    <React.Fragment>
      <Row gutter={5}>
        <Col flex={7} xs={12} sm={12}>
          <Panel title="Name" expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  id="name"
                  component={TextField}
                  name="name"
                  label="Event Rule Name"
                  validate={composeValidators(required('policy rule name is required'))}
                  required
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={5} xs={12} sm={12}>
          <Panel title="Description" expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <Field
                  id="description"
                  component={TextField}
                  name="description"
                  placeholder="Description"
                  rows={1}
                  maxRows={6}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      <Row gutter={5}>
        <Col flex={4} xs={12} sm={12}>
          <Panel title="Lambda" icon={<LambdaIcon size={20} />} expandable={false} fill>
            <Row gutter={5}>
              <Col flex={12}>
                <Autocomplete
                  id="lambdas-dropdown"
                  data={lambdas}
                  dataLabel="name"
                  dataValue="id"
                  clearOnAutocomplete
                  onClick={onClickLambdasDropDown}
                  onAutocomplete={value => handleAutoComplete(value)}
                  placeholder="Search"
                  helpText="search in the current org by lambda name/uuid, or paste a lambda uuid below"
                />

                <Field
                  component={TextField}
                  name={editMode ? 'properties.lambda.id' : 'properties.lambda'}
                  label="Lambda UUID"
                  validate={
                    composeValidators(
                      required('a valid  lambda uuid is required'),
                      validator(validateUUID, 'must be a valid UUID')
                    )
                  }
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={8} xs={12} sm={12}>
          <Panel title="Trigger On" icon={<FontIcon>input</FontIcon>} expandable={false} fill>
            <SelectionControlCheckboxes
              name="properties.match_actions"
              items={policyTriggers}
              selectedItems={values.properties.match_actions}
              onItemSelected={handleItemsSelected}
            />
          </Panel>
        </Col>
      </Row>
    </React.Fragment>
  );
};

PolicyEventRuleForm.propTypes = {
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  editMode: PropTypes.bool,
  onClickLambdasDropDown: PropTypes.func.isRequired,
  lambdas: PropTypes.array.isRequired,
};

PolicyEventRuleForm.defaultProps = {
  editMode: false,
};

export default PolicyEventRuleForm;
