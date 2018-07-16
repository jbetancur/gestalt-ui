import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { connect } from 'react-redux';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import { DialogContainer, SelectField } from 'react-md';
import { DotActivity } from 'components/ProgressIndicators';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';

const EnhancedDialog = styled(DialogContainer)`
  .md-dialog {
    min-width: 29em;
  }

  /* Fix Scrolling issue in dialogs with drop downs */
  .md-dialog-content {
    overflow: visible;
  }
`;

class MigrateModal extends PureComponent {
  static propTypes = {
    actionsModal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    sourceProvider: PropTypes.object.isRequired,
    providersData: PropTypes.array.isRequired,
    providersLoading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { provider: '' };
  }

  doIt = () => {
    this.props.onProceed(this.state.provider);
    this.props.hideModal();
  }

  providerChanged = (value) => {
    this.setState({ provider: value });
  }

  render() {
    const providers = this.props.providersData
      .filter(provider => provider.id !== this.props.sourceProvider.id)
      .map(provider => ({ id: provider.id, name: `${provider.name} (${getLastFromSplit(provider.resource_type)})` }));

    return (
      <EnhancedDialog
        id="container-actions-modal"
        visible={this.props.actionsModal.visible}
        title={this.props.title}
        modal={false}
        closeOnEsc
        defaultVisibleTransitionable
        autosizeContent={false}
        onHide={this.props.hideModal}
        actions={[
          {
            onClick: this.props.hideModal,
            label: 'Cancel',
          },
          {
            onClick: this.doIt,
            primary: true,
            label: 'Migrate',
            disabled: !this.state.provider,
          }]}
      >
        {this.props.providersLoading ?
          <DotActivity size={1} primary /> :
          <div>
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
                    value={this.state.provider}
                    onChange={this.providerChanged}
                    required
                    fullWidth
                    sameWidth
                  />
                </Col>
              </Row> : <span>There are no available providers to migrate to</span>}
          </div>}
      </EnhancedDialog>
    );
  }
}

const mapStateToProps = state => ({
  actionsModal: state.containers.actionsModals,
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withMetaResource,
  connect(mapStateToProps, actions),
)(MigrateModal);
