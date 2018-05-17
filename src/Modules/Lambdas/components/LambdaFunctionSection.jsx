import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import acceptHeaders from '../lists/acceptHeaders';
import runTimes from '../lists/runTimes';
import withLambdaState from '../hoc/withLambdaState';

class LambdaFunctionSection extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    formValues: PropTypes.object.isRequired,
    executors: PropTypes.array.isRequired,
    editMode: PropTypes.bool,
    lambdaStateActions: PropTypes.object.isRequired,
    selectedRuntime: PropTypes.object.isRequired,
  };

  static defaultProps = {
    editMode: false,
  };

  handleRuntimeProps = (id) => {
    const { editMode, executors, form, lambdaStateActions } = this.props;
    const selectedExecutor = executors.find(e => e.id === id);
    const selectedRuntime = (selectedExecutor &&
      selectedExecutor.properties &&
      selectedExecutor.properties.config &&
      selectedExecutor.properties.config.env &&
      runTimes.find(runtime => runtime.value === selectedExecutor.properties.config.env.public.RUNTIME));

    if (selectedRuntime && selectedRuntime.codeOptions.some(opt => opt.value !== 'code')) {
      form.change('properties.code_type', 'package');
    }

    if (!editMode) {
      lambdaStateActions.setRunTime(selectedRuntime);
    }

    form.change('properties.runtime', id);
  }

  render() {
    const { executors, formValues, editMode, selectedRuntime } = this.props;
    const lambdaPaneTitle = editMode ? `Function: ${formValues.properties.runtime}` : 'Function';

    return (
      <Row gutter={5}>
        <Col flex={12}>
          <Panel title={lambdaPaneTitle}>
            <Row gutter={5}>
              {!editMode &&
                <Col flex={3} xs={12} sm={12}>
                  <Field
                    id="select-runtime"
                    component={SelectField}
                    name="properties.runtime"
                    menuItems={executors}
                    itemLabel="name"
                    itemValue="id"
                    required
                    label="Runtime"
                    async
                    onChange={this.handleRuntimeProps}
                  />
                </Col>}
              {!editMode &&
                <Col flex={2} xs={12} sm={12}>
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

              <Col flex={2} xs={12} sm={12}>
                <Field
                  id="select-return-type"
                  component={SelectField}
                  name="properties.headers.Accept"
                  menuItems={acceptHeaders}
                  itemLabel="displayName"
                  itemValue="value"
                  required
                  label="Accept Header"
                />
              </Col>
              <Col flex>
                <Field
                  component={TextField}
                  name="properties.handler"
                  label="Handler"
                  helpText={selectedRuntime.format}
                  type="text"
                  required
                />
              </Col>

              {formValues.properties.code_type === 'package' &&
                <Col flex={10} xs={12} sm={12}>
                  <Field
                    component={TextField}
                    name="properties.package_url"
                    label="Package URL"
                    type="text"
                    helpText="The url to the package directory or file (if it is zipped)"
                    required
                  />
                </Col>}
              {formValues.properties.code_type === 'package' &&
                <Col flex={2} xs={12} sm={12}>
                  <Field
                    id="compressed-packageurl"
                    component={Checkbox}
                    name="properties.compressed"
                    label="Compressed Package"
                    // TODO: Find out why redux-form state for bool doesn't apply
                    checked={formValues.properties.compressed}
                  />
                </Col>}
            </Row>
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default withLambdaState(LambdaFunctionSection);
