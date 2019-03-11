import React, { Component } from 'react';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import { Form as FinalForm, Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { SelectField, TextField } from 'components/Form';
import Label from 'components/Label';
import Log from 'components/Log';
import { composeValidators, required } from 'util/forms';
import volumeModel from '../models/volume';

class VolumePanelAttach extends Component {
  static propTypes = {
    providerId: PropTypes.string.isRequired,
    volumesDropdown: PropTypes.array,
    // attachedVolumes: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    volumesDropdown: [],
  };

  state = {
    selectedVolume: volumeModel.get(),
  }

  handleSubmit = (values) => {
    const { onSubmit } = this.props;
    const { selectedVolume } = this.state;

    onSubmit({ ...values, volume_resource: selectedVolume });
  }

  handleSelectedVolume = form => (selectedVolumeId) => {
    const { volumesDropdown } = this.props;
    form.change('volume_id', selectedVolumeId);

    const selectedVolume = volumesDropdown.find(v => v.id === selectedVolumeId);

    this.setState({
      selectedVolume: volumeModel.get(selectedVolume),
    });
  }

  render() {
    const { providerId, volumesDropdown } = this.props;
    const { selectedVolume } = this.state;
    const items = volumesDropdown
      .filter(p => p.properties && p.properties.provider && p.properties.provider.id === providerId);

    return (
      <React.Fragment>
        <FinalForm
          onSubmit={this.handleSubmit}
          render={({ form, handleSubmit }) => (
            <form id="add-container-volume" onSubmit={handleSubmit} autoComplete="off">
              <Row gutter={5}>
                <Col flex={4} xs={12} sm={12}>
                  <Field
                    id="volume_id"
                    name="volume_id"
                    component={SelectField}
                    label="Volume"
                    itemLabel="name"
                    itemValue="id"
                    menuItems={items.length ? items : [{ id: null, name: 'No Available Volumes' }]}
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
            </form>
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

export default VolumePanelAttach;
