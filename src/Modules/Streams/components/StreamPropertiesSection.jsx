import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { TextField, SelectField } from 'components/ReduxFormFields';
import { Panel } from 'components/Panels';

const StreamPropertiesSection = ({ lambdas, datafeeds }) => {
  // TODO: Remove when we have a Search/Filter query api
  const lambdasFiltered =
    lambdas.filter(l => l.properties && l.properties.runtime && (l.properties.runtime === 'java' || l.properties.runtime === 'java;scala'));

  return (
    <Row gutter={5}>
      <Col flex={4} xs={12} sm={12}>
        <Panel title="Input Feed" expandable={false} fill>
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
                helpText="Specify an Input Feed"
                async
                required
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
              />
            </Col>

            <Col flex={4} xs={6} sm={6}>
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
            <Col flex={4} xs={6} sm={6}>
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
              />
            </Col>
          </Row>
        </Panel>
      </Col>

      <Col flex={4} xs={12} sm={12}>
        <Panel title="Transform Feed" expandable={false} fill>
          <Row gutter={5}>
            <Col flex={12}>
              <Field
                id="Lambda"
                name="properties.processor.lambdaId"
                label="Lambda"
                component={SelectField}
                menuItems={lambdasFiltered.length ? lambdasFiltered : [{ id: null, name: 'No JVM Lambdas were found' }]}
                itemLabel="name"
                itemValue="id"
                helpText="Note: only JVM based lambdas are supported at this time"
                async
                required
              />
            </Col>
          </Row>
        </Panel>
      </Col>

      <Col flex={4} xs={12} sm={12}>
        <Panel title="Output Feed" expandable={false} fill>
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
                helpText="Specify an Output Feed"
                async
                required
              />
            </Col>
          </Row>
        </Panel>
      </Col>
    </Row>
  );
};

StreamPropertiesSection.propTypes = {
  lambdas: PropTypes.array.isRequired,
  datafeeds: PropTypes.array.isRequired,
};

StreamPropertiesSection.defaultProps = {
  // editMode: false,
};

export default StreamPropertiesSection;
