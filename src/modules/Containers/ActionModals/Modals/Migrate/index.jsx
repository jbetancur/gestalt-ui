import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Dialog from 'react-md/lib/Dialogs';
import SelectField from 'react-md/lib/SelectFields';

class MigrateModal extends PureComponent {
  static propTypes = {
    actionsModal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    provider: PropTypes.object.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
  };

  static defaultProps = {
    body: '',
  };

  constructor(props) {
    super(props);

    this.state = { provider: '' };
  }

  fetchProviders() {
    this.props.fetchProviders(this.props.params.fqon, this.props.params.environmentId, 'Marathon');
  }

  doIt() {
    this.props.onProceed(this.state.provider);
    this.props.hideModal();
  }

  providerChanged(value) {
    this.setState({ provider: value });
  }

  render() {
    return (
      <Dialog
        id="container-actions-modal"
        visible={this.props.actionsModal.visible}
        title={this.props.title}
        modal={false}
        closeOnEsc
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
        {this.props.providers.filter(provider => provider.id !== this.props.provider.id).length ?
          <div className="flex-row">
            <div className="flex-row center-center">
              <SelectField
                id="container-scaleto"
                className="flex-12"
                label="Migrate to Provider"
                lineDirection="center"
                menuItems={this.props.providers.filter(provider => provider.id !== this.props.provider.id)}
                itemLabel="name"
                itemValue="id"
                value={this.state.provider}
                onFocus={() => this.fetchProviders()}
                onChange={value => this.providerChanged(value)}
                required
              />
            </div>
          </div> : <span>There are no available providers to migrate to</span>}
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
    providers: state.containers.providers.providers,
    pendingProviders: state.containers.providers.pending,
  };
}

function actions(dispatch) {
  return {
    hideModal: () => {
      dispatch({ type: 'HIDE_CONTAINER_MODAL' });
    }
  };
}

export default connect(mapStateToProps, actions)(MigrateModal);
