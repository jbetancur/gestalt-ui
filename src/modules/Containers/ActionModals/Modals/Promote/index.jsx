import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { metaActions } from 'modules/MetaResource';
import Dialog from 'react-md/lib/Dialogs';
import SelectField from 'react-md/lib/SelectFields';
import DotActivity from 'components/DotActivity';
import * as actions from '../../actions';

const EnhancedDialog = styled(Dialog)`
  .md-dialog {
    min-width: 24em;
  }

  // Fix Scrolling issue in dialogs with drop downs
  .md-dialog-content {
      overflow: visible;
  }
`;

class PromoteModal extends PureComponent {
  static propTypes = {
    actionsModal: PropTypes.object.isRequired,
    onProceed: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    environments: PropTypes.array.isRequired,
    pendingEnvironments: PropTypes.bool.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    body: '',
  };

  constructor(props) {
    super(props);

    this.state = { environment: '' };
  }

  componentDidMount() {
    this.props.fetchEnvironments(this.props.params.fqon, this.props.params.workspaceId);
  }

  componentWillUnMount() {
    this.props.unloadEnvironments();
  }

  doIt() {
    this.props.onProceed(this.props.environments.find(env => env.id === this.state.environment));
    this.props.hideModal();
  }

  environmentChanged(value) {
    this.setState({ environment: value });
  }

  render() {
    const environments = this.props.environments
      .filter(environment => environment.id !== this.props.params.environmentId)
      .map(environment => ({ id: environment.id, name: environment.description || environment.name }));

    return (
      <EnhancedDialog
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
            label: 'Promote',
            disabled: !this.state.environment,
          }]}
      >
        {this.props.pendingEnvironments ? <DotActivity size={1} dropdown /> :
        <div>
          {environments.length ?
            <div className="flex-row">
              <div className="flex-row center-center">
                <SelectField
                  id="container-promoteto"
                  className="flex-12"
                  label="Promote to Environment"
                  lineDirection="center"
                  menuItems={environments}
                  itemLabel="name"
                  itemValue="id"
                  value={this.state.environment}
                  onChange={value => this.environmentChanged(value)}
                  required
                />
              </div>
            </div> : <span>There are no available environments to promote to</span>}
        </div>}
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    actionsModal: state.containers.actionsModals,
    environments: state.metaResource.environments.environments,
    pendingEnvironments: state.metaResource.environments.pending,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(PromoteModal);
