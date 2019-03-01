import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FontIcon } from 'react-md';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField } from 'components/Form';
import { Panel } from 'components/Panels';
import { composeValidators, required, min, max } from 'util/forms';

const StreamPropertiesSection = ({ lambdas, datafeeds }) => (
  <Row gutter={5}>
    <Col flex={4} xs={12} sm={12}>
      <Panel title="Input Feed" icon={<FontIcon>trending_flat</FontIcon>} expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="InputFeed"
              name="properties.processor.inputStreamConfig.feedID"
              label="Feed"
              component={SelectField}
              menuItems={datafeeds.length ? datafeeds : [{ id: null, name: 'No datafeeds were found' }]}
              itemLabel="name"
              itemValue="id"
              helpText="Specify an Input Feed"
              async
              required
              validate={required()}
            />
          </Col>

          <Col flex={4} xs={6} sm={6}>
            <Field
              name="properties.processor.inputStreamConfig.partitions[0].partition"
              label="Partition"
              component={TextField}
              type="number"
              min="0"
              parse={value => Number(value)}
              required
              validate={composeValidators(
                required('required', true)
              )}
            />
          </Col>

          <Col flex={4} xs={6} sm={6}>
            <Field
              name="properties.processor.inputStreamConfig.partitions[0].startOffset"
              label="Start Offset"
              component={TextField}
              type="number"
              min="-1"
              parse={value => Number(value)}
              required
              validate={composeValidators(
                required('required', true)
              )}
            />
          </Col>

          <Col flex={4} xs={6} sm={6}>
            <Field
              name="properties.processor.inputStreamConfig.partitions[0].endOffset"
              label="End Offset"
              component={TextField}
              type="number"
              min="-1"
              parse={value => Number(value)}
              required
              validate={composeValidators(
                required('required', true)
              )}
            />
          </Col>

          <Col flex={4} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.cpus"
              min={0.5}
              max={64.0}
              step={0.1}
              label="CPU"
              type="number"
              parse={value => parseFloat(value)}
              required
              validate={composeValidators(
                required(),
                min(0.5)
              )}
            />
          </Col>
          <Col flex={4} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.mem"
              min={512}
              max={524288}
              step={128}
              label="Memory"
              type="number"
              parse={value => Number(value)}
              required
              validate={composeValidators(
                required(),
                min(512),
                max(524288),
              )}
            />
          </Col>
          <Col flex={4} xs={6} sm={6}>
            <Field
              component={TextField}
              name="properties.parallelization"
              min={1}
              step={1}
              label="Parallelization"
              type="number"
              parse={value => Number(value)}
              required
              validate={composeValidators(
                required()
              )}
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={4} xs={12} sm={12}>
      <Panel title="Transform Lambda" icon={<FontIcon>transform</FontIcon>} expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="Lambda"
              name="properties.processor.lambdaId"
              label="Lambda"
              component={SelectField}
              menuItems={lambdas.length ? lambdas : [{ id: null, name: 'No JVM Lambdas were found' }]}
              itemLabel="name"
              itemValue="id"
              helpText="Note: only JVM based lambdas are supported at this time"
              async
              required
              validate={required()}
            />
          </Col>
        </Row>
      </Panel>
    </Col>

    <Col flex={4} xs={12} sm={12}>
      <Panel title="Output Feed" icon={<FontIcon>trending_flat</FontIcon>} expandable={false} fill>
        <Row gutter={5}>
          <Col flex={12}>
            <Field
              id="OutputFeed"
              name="properties.processor.outputStreamConfig.feedID"
              label="Feed"
              component={SelectField}
              menuItems={datafeeds.length ? datafeeds : [{ id: null, name: 'No datafeeds were found' }]}
              itemLabel="name"
              itemValue="id"
              helpText="Specify an Output Feed"
              async
              required
              validate={required()}
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
};

StreamPropertiesSection.defaultProps = {
  // editMode: false,
};

export default StreamPropertiesSection;
