import React, { Component } from 'react';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import { withPickerData, metaModels } from 'Modules/MetaResource';
import { Form as FinalForm, Field } from 'react-final-form';
import Form from 'components/Form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/ReduxFormFields';
import Label from 'components/Label';
import Log from 'components/Log';
import { composeValidators, required } from 'util/forms';

class VolumePanelAttach extends Component {
  static propTypes = {
    providerId: PropTypes.string.isRequired,
    volumesData: PropTypes.array.isRequired,
    // attachedVolumes: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  state = {
    selectedVolume: metaModels.volume.get(),
  }

  handleSubmit = (values) => {
    const { onSubmit } = this.props;
    const { selectedVolume } = this.state;

    onSubmit({ ...values, volume_resource: selectedVolume });
  }

  handleSelectedVolume = form => (selectedVolumeId) => {
    const { volumesData } = this.props;
    form.change('volume_id', selectedVolumeId);

    const selectedVolume = volumesData.find(v => v.id === selectedVolumeId);

    this.setState({
      selectedVolume: metaModels.volume.get(selectedVolume),
    });
  }

  render() {
    const { providerId, volumesData } = this.props;
    const { selectedVolume } = this.state;
    const volumes = volumesData
      .filter(p => p.properties && p.properties.provider && p.properties.provider.id === providerId);

    return (
      <React.Fragment>
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

        {selectedVolume.id &&
          <Row gutter={5}>
            <Col flex={3}>
              <Label>Name: </Label>
              <div>{selectedVolume.name}</div>
            </Col>

            <Col flex={3}>
              <Label>Type: </Label>
              <div>{selectedVolume.properties.type}</div>
            </Col>
            <Col flex={3}>
              <Label>Size: </Label>
              <div>{selectedVolume.properties.size} MiB</div>
            </Col>
            <Col flex={3}>
              <Label>Access Mode: </Label>
              <div>{selectedVolume.properties.access_mode}</div>
            </Col>
            <Col flex={12}>
              <Label>Config: </Label>
              <Log
                logItems={selectedVolume.properties.config && yaml.safeDump(selectedVolume.properties.config).split(/\n/)}
              />
            </Col>
          </Row>}
      </React.Fragment>
    );
  }
}

export default withPickerData({ entity: 'volumes', label: 'Volumes' })(VolumePanelAttach);