import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field, FormSpy } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Conditional } from 'components/Form';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Caption } from 'components/Typography';

const LambdaFunctionSection = memo(({ editMode, selectedRuntime }) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Field
        component={TextField}
        name="properties.handler"
        label="Handler"
        helpText={selectedRuntime.format}
        type="text"
        required
      />
    </Col>

    {!editMode &&
      <Col flex={12}>
        <Field
          id="select-code-type"
          component={SelectField}
          name="properties.code_type"
          menuItems={selectedRuntime.codeOptions || [{ displayName: 'Package', value: 'package' }]}
          itemLabel="displayName"
          itemValue="value"
          required
          label="Code Type"
          disabled={editMode}
        />
      </Col>}

    <Conditional when="properties.code_type" is="package">
      <Row gutter={5}>
        <Col flex={12}>
          <Field
            component={TextField}
            name="properties.package_url"
            label="Package URL"
            type="text"
            helpText="The url to the package directory or file"
            required
            rows={1}
            maxRows={4}
          />
        </Col>
        <FormSpy subscription={{ values: true }}>
          {({ values }) => (
            <Col flex={6} xs={12} sm={12}>
              <Field
                id="compressed-packageurl"
                component={Checkbox}
                name="properties.compressed"
                label="Zipped Package"
                checked={values.properties.compressed}
              />
              <Caption light>if the package URL contents are zipped</Caption>
            </Col>
          )}
        </FormSpy>
      </Row>
    </Conditional>
  </Row>
));

LambdaFunctionSection.propTypes = {
  editMode: PropTypes.bool,
  selectedRuntime: PropTypes.object.isRequired,
};

LambdaFunctionSection.defaultProps = {
  editMode: false,
};

export default LambdaFunctionSection;
