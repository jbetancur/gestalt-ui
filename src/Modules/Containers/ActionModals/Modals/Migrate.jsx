import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { connect } from 'react-redux';
import { withPickerData } from 'Modules/MetaResource';
import { DialogContainer, SelectField } from 'react-md';
import { DotActivity } from 'components/ProgressIndicators';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';

class MigrateModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    sourceProvider: PropTypes.object.isRequired,
    providersData: PropTypes.array.isRequired,
    providersLoading: PropTypes.bool.isRequired,
  };

  state = { provider: '' };

  doIt = () => {
    const { onProceed, hideModal } = this.props;

    onProceed(this.state.provider);
    hideModal();
  }

  providerChanged = (value) => {
    this.setState({ provider: value });
  }

  render() {
    const { title, providersData, providersLoading, sourceProvider, hideModal, visible } = this.props;
    const { provider } = this.state;
    const providers = providersData
      .filter(p => p.id !== sourceProvider.id)
      .map(p => ({ id: p.id, name: `${p.name} (${getLastFromSplit(p.resource_type)})` }));

    return (
      <DialogContainer
        id="container-migrate-modal"
        visible={visible}
        title={title}
        width="28em"
        closeOnEsc
        defaultVisibleTransitionable
        onHide={hideModal}
        actions={[
          {
            onClick: hideModal,
            label: 'Cancel',
          },
          {
            onClick: this.doIt,
            primary: true,
            label: 'Migrate',
            disabled: !provider,
          }]}
      >
        {providersLoading ?
          <DotActivity size={1} primary /> :
          <React.Fragment>
            {providers.length ?
              <Row center>
                <Col flex={12}>
                  <SelectField
                    id="container-scaleto"
                    label="Migrate to Provider"
                    lineDirection="center"
                    menuItems={providers}
                    itemLabel="name"
                    itemValue="id"
                    value={provider}
                    onChange={this.providerChanged}
                    required
                    fullWidth
                    sameWidth
                    simplifiedMenu={false}
                  />
                </Col>
              </Row> : <span>There are no available providers to migrate to</span>}
          </React.Fragment>}
      </DialogContainer>
    );
  }
}

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  connect(null, actions),
)(MigrateModal);
