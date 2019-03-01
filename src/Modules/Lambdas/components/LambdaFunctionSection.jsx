import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Conditional, TextField, SelectField, Checkbox } from 'components/Form';
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
            multiline
            rowsMax={4}
          />
        </Col>
        <Col flex={6} xs={12} sm={12}>
          <Field
            id="compressed-packageurl"
            component={Checkbox}
            type="checkbox"
            name="properties.compressed"
            label="Zipped Package"
          />
          <div>
            <Caption light>if the package URL contents are zipped</Caption>
          </div>
        </Col>
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
