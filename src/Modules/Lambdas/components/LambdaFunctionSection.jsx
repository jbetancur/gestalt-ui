import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import withLambdaState from '../hocs/withLambdaState';

class LambdaFunctionSection extends PureComponent {
  static propTypes = {
    formValues: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
    selectedRuntime: PropTypes.object.isRequired,
  };

  static defaultProps = {
    editMode: false,
  };

  render() {
    const { formValues, editMode, selectedRuntime } = this.props;
    const title = selectedRuntime.value ? `Function (${selectedRuntime.value})` : 'Function';

    return (
      <Panel
        title={title}
        expandable={false}
        fill
      >
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

          {formValues.properties.code_type === 'package' &&
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

              <Col flex={6} xs={12} sm={12}>
                <Field
                  id="compressed-packageurl"
                  component={Checkbox}
                  name="properties.compressed"
                  label="Zipped Package"
                  checked={formValues.properties.compressed}
                />
                <Caption light>if the package URL contents are zipped</Caption>
              </Col>
            </Row>}
        </Row>
      </Panel>
    );
  }
}

export default withLambdaState(LambdaFunctionSection);
