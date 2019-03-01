import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { LambdaIcon } from 'components/Icons';
import { Autocomplete, FontIcon } from 'react-md';
import { Panel } from 'components/Panels';
import { TextField } from 'components/Form';
import { composeValidators, validator, required } from 'util/forms';
import { isUUID } from 'validator';
import policyResourceTypes from '../lists/policyResourceTypes';
import MatchActions from './MatchActions';

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
  onClickLambdasDropDown,
  lambdas,
}) => {
  const handleAutoComplete = (value) => {
    form.change('properties.lambda.id', value);
  };

  return (
    <React.Fragment>
      <Row gutter={5}>
        <Col flex={12}>
          <Panel expandable={false} fill>
            <Row gutter={5}>
              <Col flex={6} xs={12}>
                <Field
                  id="name"
                  component={TextField}
                  name="name"
                  label="Event Rule Name"
                  validate={composeValidators(required('policy rule name is required'))}
                  required
                  autoFocus
                />
              </Col>
              <Col flex={6} xs={12}>
                <Field
                  id="description"
                  component={TextField}
                  name="description"
                  label="Description"
                  multiline
                  rowsMax={6}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      <Row gutter={5}>
        <Col flex={4} xs={12} sm={12}>
          <Panel title="Invoke Lambda" icon={<LambdaIcon size={20} />} expandable={false}>
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
                  name="properties.lambda.id"
                  label="Lambda UUID"
                  validate={
                    composeValidators(
                      required('a valid lambda uuid is required'),
                      validator(validateUUID, 'must be a valid UUID')
                    )
                  }
                />
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col flex={8} xs={12} sm={12}>
          <Panel title="On Event(s)" icon={<FontIcon>input</FontIcon>} expandable={false} fill noPadding>
            <MatchActions
              fieldName="properties.match_actions"
              actions={policyTriggers}
            />
          </Panel>
        </Col>
      </Row>
    </React.Fragment>
  );
};

PolicyEventRuleForm.propTypes = {
  form: PropTypes.object.isRequired,
  onClickLambdasDropDown: PropTypes.func.isRequired,
  lambdas: PropTypes.array.isRequired,
};

export default PolicyEventRuleForm;
