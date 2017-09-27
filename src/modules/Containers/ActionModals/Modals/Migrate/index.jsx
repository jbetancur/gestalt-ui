import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withMetaResource } from 'modules/MetaResource';
import Dialog from 'react-md/lib/Dialogs';
import SelectField from 'react-md/lib/SelectFields';
import DotActivity from 'components/DotActivity';
import actions from '../../actions';

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
    provider: PropTypes.object.isRequired,
    fetchProvidersByType: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    providersByType: PropTypes.array.isRequired,
    providersByTypePending: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    body: '',
  };

  constructor(props) {
    super(props);

    this.state = { provider: '' };
  }

  componentDidMount() {
    this.props.fetchProvidersByType(this.props.params.fqon, this.props.params.environmentId, 'environments', 'CaaS');
  }

  doIt() {
    this.props.onProceed(this.state.provider);
    this.props.hideModal();
  }

  providerChanged(value) {
    this.setState({ provider: value });
  }

  formatResourceType(resourceType) {
    const split = resourceType.split('::');
    return split[split.length - 1];
  }

  render() {
    const providers = this.props.providersByType
      .filter(provider => provider.id !== this.props.provider.id)
      .map(provider => ({ id: provider.id, name: `${provider.name} (${this.formatResourceType(provider.resource_type)})` }));

    return (
      <EnhancedDialog
        id="container-actions-modal"
        visible={this.props.actionsModal.visible}
        title={this.props.title}
        modal={false}
        closeOnEsc
        autosizeContent={false}
        onHide={() => this.props.hideModal()}
        actions={[
          {
            onClick: () => this.props.hideModal(),
            label: 'Cancel',
          },
          {
            onClick: () => this.doIt(),
            primary: true,
            label: 'Migrate',
            disabled: !this.state.provider,
          }]}
      >
        {this.props.providersByTypePending ?
          <DotActivity size={1} primary /> :
          <div>
            {providers.length ?
              <div className="flex-row">
                <div className="flex-row center-center">
                  <SelectField
                    id="container-scaleto"
                    className="flex-12"
                    label="Migrate to Provider"
                    lineDirection="center"
                    menuItems={providers}
                    itemLabel="name"
                    itemValue="id"
                    value={this.state.provider}
                    onChange={value => this.providerChanged(value)}
                    required
                  />
                </div>
              </div> : <span>There are no available providers to migrate to</span>}
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

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions))(MigrateModal));
