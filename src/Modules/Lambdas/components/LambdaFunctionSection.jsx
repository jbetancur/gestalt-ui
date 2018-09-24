import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField, Checkbox } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';
import { Caption } from 'components/Typography';
import ListIcon from './ListIcon';
import runTimes from '../lists/runTimes';
import withLambdaState from '../hocs/withLambdaState';

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

    // set memory to the default recommended values
    if (!editMode && selectedRuntime && selectedRuntime.defaultMem) {
      form.change('properties.memory', selectedRuntime.defaultMem);
    }

    if (!editMode) {
      lambdaStateActions.setRunTime(selectedRuntime);
    }

    form.change('properties.runtime', id);
  }

  render() {
    const { executors, formValues, editMode, selectedRuntime } = this.props;
    const title = selectedRuntime.value ? `Function (${selectedRuntime.value})` : 'Function';
    const icon = selectedRuntime.value ? <ListIcon runtime={selectedRuntime.value} /> : null;

    return (
      <Panel
        title={title}
        icon={icon}
        expandable={false}
        fill
      >
        <Row gutter={5}>
          {!editMode &&
            <Col flex={4} xs={12} sm={12}>
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
        </Row>

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
              />
            </Col>

            <Col flex={6} xs={12} sm={12}>
              <Field
                id="compressed-packageurl"
                component={Checkbox}
                name="properties.compressed"
                label="Zipped Package"
                // TODO: Find out why redux-form state for bool doesn't apply
                checked={formValues.properties.compressed}
              />
              <Caption light>if the package URL contents are zipped</Caption>
            </Col>
          </Row>}
      </Panel>
    );
  }
}

export default withLambdaState(LambdaFunctionSection);
