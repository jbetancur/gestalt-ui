import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import Dialog from 'react-md/lib/Dialogs';
import SelectField from 'react-md/lib/SelectFields';
import DotActivity from 'components/DotActivity';
import actions from '../actions';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    min-width: 24em;
  }

  // Fix Scrolling issue in dialogs with drop downs
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
    fetchProvidersByType: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    providersByType: PropTypes.array.isRequired,
    providersByTypePending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { provider: '' };
  }

  componentDidMount() {
    console.log(this.props.sourceProvider);
    this.props.fetchProvidersByType(this.props.match.params.fqon, this.props.match.params.environmentId, 'environments', 'CaaS');
  }

  doIt = () => {
    this.props.onProceed(this.state.provider);
    this.props.hideModal();
  }

  providerChanged = (value) => {
    this.setState({ provider: value });
  }

  formatResourceType(resourceType) {
    const split = resourceType.split('::');
    return split[split.length - 1];
  }

  render() {
    const providers = this.props.providersByType
      .filter(provider => provider.id !== this.props.sourceProvider.id)
      .map(provider => ({ id: provider.id, name: `${provider.name} (${this.formatResourceType(provider.resource_type)})` }));

    return (
      <EnhancedDialog
        id="container-actions-modal"
        visible={this.props.actionsModal.visible}
        title={this.props.title}
        modal={false}
        closeOnEsc
        defaultVisibleTransitionable
        autosizeContent={false}
        onHide={() => this.props.hideModal()}
        actions={[
          {
            onClick: () => this.props.hideModal(),
            label: 'Cancel',
          },
          {
            onClick: this.doIt,
            primary: true,
            label: 'Migrate',
            disabled: !this.state.provider,
          }]}
      >
        {this.props.providersByTypePending ?
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
                  />
                </Col>
              </Row> : <span>There are no available providers to migrate to</span>}
          </div>}
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
  };
}

export default compose(
  withMetaResource,
  withRouter,
  connect(mapStateToProps, Object.assign({}, actions)),
)(MigrateModal);
