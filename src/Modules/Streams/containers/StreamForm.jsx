import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Link, withRouter } from 'react-router-dom';
import { TextField, SelectField } from 'components/ReduxFormFields';
import { Field } from 'react-final-form';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import { Panel } from 'components/Panels';

const StreamForm = ({ editMode, handleSubmit, submitting, match, lambdas, datafeeds }) => (
  <Form onSubmit={handleSubmit}>
    <Row gutter={5}>
      <Col flex={12}>
        <Panel title="General" expandable={false}>
          <Row gutter={5}>
            <Col flex={4} xs={12}>
              <Field
                id="name"
                component={TextField}
                name="name"
                label="Name"
                required
              />
            </Col>

            <Col flex={8} xs={12}>
              <Field
                id="description"
                component={TextField}
                name="description"
                label="Description"
              />
            </Col>
          </Row>
        </Panel>
      </Col>

      <Col flex={12}>
        <Panel title="Input Feed" expandable={false}>
          <Row gutter={5}>
            <Col flex={6}>
              <Field
                name="properties.processor.input_stream_config.feed_id"
                label="Feed"
                component={SelectField}
                menuItems={datafeeds}
                itemLabel="name"
                itemValue="id"
                required
              />
            </Col>

            <Col flex={6}>
              <Field
                name="properties.processor.input_stream_config.name"
                component={TextField}
                label="Feed Name"
                required
              />
            </Col>

            <Col flex={2}>
              <Field
                name="properties.processor.input_stream_config.partition.partition"
                label="Partition"
                component={TextField}
                type="number"
                parse={value => Number(value)}
                required
              />
            </Col>

            <Col flex={2}>
              <Field
                name="properties.processor.input_stream_config.partition.startOffset"
                label="Start Offset"
                component={TextField}
                type="number"
                parse={value => Number(value)}
                required
              />
            </Col>

            <Col flex={2}>
              <Field
                name="properties.processor.input_stream_config.partition.endOffset"
                label="End Offset"
                component={TextField}
                type="number"
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
                required
                parse={value => parseFloat(value)}
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
                required
                parse={value => Number(value)}
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
                required
                parse={value => Number(value)}
              />
            </Col>
          </Row>
        </Panel>
      </Col>

      <Row gutter={5}>
        <Col flex={12}>
          <Panel title="Lambda" expandable={false}>
            <Row gutter={5}>
              <Col flex={6}>
                <Field
                  name="lambda_id"
                  label="Lambda"
                  component={SelectField}
                  menuItems={lambdas}
                  itemLabel="name"
                  itemValue="id"
                  required
                />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      <Row gutter={5}>
        <Col flex={12}>
          <Panel title="Output Feed" expandable={false}>
            <Row gutter={5}>
              <Col flex={6}>
                <Field
                  name="properties.processor.output_stream_config.feed_id"
                  label="Feed"
                  component={SelectField}
                  menuItems={datafeeds}
                  itemLabel="name"
                  itemValue="id"
                  required
                />
              </Col>

              <Col flex={6}>
                <Field
                  name="properties.processor.output_stream_config.name"
                  component={TextField}
                  label="Feed Name"
                  required
                />
              </Col>
            </Row>
          </Panel>
        </Col>
      </Row>

      <FullPageFooter>
        <Button
          to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streams`}
          flat
          component={Link}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          primary
          raised
          disabled={submitting}
        >
          {editMode ? 'Update' : 'Create'}
        </Button>
      </FullPageFooter>
    </Row>
  </Form>
);

StreamForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  lambdas: PropTypes.array.isRequired,
  datafeeds: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

StreamForm.defaultProps = {
  editMode: false,
};

export default withRouter(StreamForm);
