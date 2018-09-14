import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm, Field } from 'react-final-form';
import Form from 'components/Form';
import { metaModels } from 'Modules/MetaResource';
import { Row, Col } from 'react-flexybox';
import { TextField } from 'components/ReduxFormFields';
import { formatName, composeValidators, required } from 'util/forms';
import VolumeConfigSection from './VolumeConfigSection';

const initialValues = metaModels.volume.create({
  properties: {
    type: 'host_path',
    size: 1,
    size_unit: 'MiB',
    access_mode: 'ReadWriteOnce',
    config: {},
  },
});

class VolumePanelCreate extends Component {
  static propTypes = {
    selectedProvider: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  handleSubmit = (values) => {
    const { onSubmit, selectedProvider } = this.props;
    const { mount_path, ...rest } = values;
    const volumeResource = {
      ...rest,
      properties: {
        ...rest.properties,
        provider: {
          id: selectedProvider.provider.id,
        },
      },
    };

    onSubmit({ mount_path, volume_resource: volumeResource });
  }

  render() {
    const { selectedProvider } = this.props;

    return (
      <FinalForm
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        render={({ handleSubmit, values }) => (
          <Form id="add-container-volume" onSubmit={handleSubmit} autoComplete="off">
            <Row gutter={5}>
              <Col flex={5} xs={12} sm={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Volume Name"
                  type="text"
                  parse={formatName}
                  helpText="alphanumeric and dashes are allowed"
                  validate={composeValidators(required('a volume name is required'))}
                  required
                />
              </Col>

              <Col flex={7} xs={12} sm={12}>
                <Field
                  name="mount_path"
                  type="text"
                  component={TextField}
                  label="Mount Path"
                  validate={composeValidators(required())}
                  required
                />
              </Col>

              <Col flex={12}>
                <VolumeConfigSection
                  selectedProvider={selectedProvider}
                  formValues={values}
                />
              </Col>
            </Row>
          </Form>
        )}
      />
    );
  }
}

export default VolumePanelCreate;
