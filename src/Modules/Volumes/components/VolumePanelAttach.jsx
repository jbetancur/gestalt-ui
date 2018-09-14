import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withPickerData } from 'Modules/MetaResource';
import { Form as FinalForm, Field } from 'react-final-form';
import Form from 'components/Form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import { composeValidators, required } from 'util/forms';

class VolumePanelAttach extends Component {
  static propTypes = {
    providerId: PropTypes.string.isRequired,
    volumesData: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  state = {
    selectedVolumeId: {},
  }

  handleSubmit = (values) => {
    const { onSubmit, volumesData } = this.props;
    const { selectedVolumeId } = this.state;
    const volumeResource = volumesData.find(v => v.id === selectedVolumeId) || {};

    onSubmit({ ...values, volume_resource: volumeResource });
  }

  handleSelectedVolume = form => (selectedVolumeId) => {
    form.change('volume_id', selectedVolumeId);
    this.setState({ selectedVolumeId });
  }

  render() {
    const { providerId, volumesData } = this.props;
    const volumes = volumesData
      .filter(p => p.properties && p.properties.provider && p.properties.provider.id === providerId);

    return (
      <FinalForm
        onSubmit={this.handleSubmit}
        render={({ form, handleSubmit }) => (
          <Form id="add-container-volume" onSubmit={handleSubmit} autoComplete="off">
            <Row gutter={5}>
              <Col flex={4} xs={12} sm={12}>
                <Field
                  id="volume_id"
                  name="volume_id"
                  component={SelectField}
                  simplifiedMenu={false}
                  label="Volume"
                  itemLabel="name"
                  itemValue="id"
                  menuItems={volumes.length ? volumes : [{ id: null, name: 'No Available Volumes' }]}
                  validate={composeValidators(required())}
                  onChange={this.handleSelectedVolume(form)}
                  required
                />
              </Col>
              <Col flex={8} xs={12} sm={12}>
                <Field
                  name="mount_path"
                  type="text"
                  component={TextField}
                  label="Mount Path"
                  validate={composeValidators(required())}
                  required
                />
              </Col>
            </Row>
          </Form>
        )}
      />
    );
  }
}

export default withPickerData({ entity: 'volumes', label: 'Volumes' })(VolumePanelAttach);
