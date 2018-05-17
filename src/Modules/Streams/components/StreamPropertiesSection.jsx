import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const StreamPropertiesSection = ({ lambdas, datafeeds, editMode }) => (
  <Row gutter={5}>
    <Col flex={12}>
      <Panel title="Lambda" expandable={false}>
        <Row gutter={5}>
          {!editMode &&
            <Col flex={6} xs={12} sm={12}>
              <Field
                id="Lambda"
                name="properties.processor.lambdaId"
                label="Lambda"
                component={SelectField}
                menuItems={lambdas}
                itemLabel="name"
                itemValue="id"
                helpText="Select a lambda to transform the stream"
                async
                required
              />
            </Col>}

          <Col flex={6} xs={12} sm={12}>
            <Field
              name="properties.lambda_provider.url"
              label="Laser Provider URL"
              component={TextField}
              helpText="The laser provider url"
              required
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={6} xs={12} sm={12}>
      <Panel title="Input Feed" expandable={false} minHeight="270px">
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="InputFeed"
              name="properties.processor.inputStreamConfig.feedID"
              label="Feed"
              component={SelectField}
              menuItems={datafeeds}
              itemLabel="name"
              itemValue="id"
              helpText="Specify and Input Feed"
              async
              required
            />
          </Col>

          <Col flex={12}>
            <Field
              name="properties.processor.inputStreamConfig.name"
              component={TextField}
              label="Feed Name"
              required
            />
          </Col>

          <Col flex={2} xs={6} sm={6}>
            <Field
              name="properties.processor.inputStreamConfig.partition.partition"
              label="Partition"
              component={TextField}
              type="number"
              min="0"
              parse={value => Number(value)}
              required
            />
          </Col>

          <Col flex={2} xs={6} sm={6}>
            <Field
              name="properties.processor.inputStreamConfig.partition.startOffset"
              label="Start Offset"
              component={TextField}
              type="number"
              min="-1"
              parse={value => Number(value)}
              required
            />
          </Col>

          <Col flex={2} xs={6} sm={6}>
            <Field
              name="properties.processor.inputStreamConfig.partition.endOffset"
              label="End Offset"
              component={TextField}
              type="number"
              min="-1"
              parse={value => Number(value)}
              required
            />
          </Col>

          <Col flex={2} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.cpus"
              min={0.1}
              max={4.0}
              step={0.1}
              label="CPU"
              type="number"
              parse={value => parseFloat(value)}
              required
            />
          </Col>
          <Col flex={2} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.mem"
              min={256}
              max={2048}
              step={256}
              label="Memory"
              type="number"
              parse={value => Number(value)}
              required
            />
          </Col>
          <Col flex={2} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.parallelization"
              min={1}
              step={1}
              label="Parallelization"
              type="number"
              parse={value => Number(value)}
              required
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={6} xs={12} sm={12}>
      <Panel title="Output Feed" expandable={false} minHeight="270px">
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="OutputFeed"
              name="properties.processor.outputStreamConfig.feedID"
              label="Feed"
              component={SelectField}
              menuItems={datafeeds}
              itemLabel="name"
              itemValue="id"
              helpText="Specify and Output Feed"
              async
              required
            />
          </Col>

          <Col flex={12}>
            <Field
              name="properties.processor.outputStreamConfig.name"
              component={TextField}
              label="Feed Name"
              required
            />
          </Col>
        </Row>
      </Panel>
    </Col>
  </Row>
);

StreamPropertiesSection.propTypes = {
  lambdas: PropTypes.array.isRequired,
  datafeeds: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

StreamPropertiesSection.defaultProps = {
  editMode: false,
};

export default StreamPropertiesSection;
