import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import { media } from 'util/helpers/media';
import { DialogContainer } from 'react-md';
import { ModalTitle } from 'components/Modal';
import PortMapForm from '../../components/PortMapForm';
import actions from '../../actions';
import validate from '../../components/PortMapForm/validations';

const EnhancedDialog = styled(DialogContainer) `
  .md-dialog {
    width: 100%;
    max-width: 35em;

    .md-dialog-content {
      min-height: 26em;
      ${media.xs`min-height: 30em`};
      ${media.sm`min-height: 30em`};
      ${media.md`min-height: 30em`};
      padding-left: 1em;
      padding-right: 1em;
      overflow: visible;
    }
  }
`;

class PortMapModel extends PureComponent {
  static propTypes = {
    addPortmapping: PropTypes.func.isRequired,
    hidePortmapModal: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    portmapModal: PropTypes.object.isRequired,
    networkType: PropTypes.string,
  };

  static defaultProps = {
    networkType: 'HOST'
  }

  constructor(props) {
    super(props);
  }

  addPortmapping = (values) => {
    const payload = { ...values };

    if (values.virtual_hosts && values.expose_endpoint) {
      let hosts = values.virtual_hosts;
      hosts = hosts.replace(/[\s,]+/g, ',');

      payload.virtual_hosts = hosts.split(',');
    } else {
      delete payload.virtual_hosts;
    }

    this.props.addPortmapping(payload);
    this.props.hidePortmapModal();
    this.props.reset();
  }

  render() {
    return (
      <EnhancedDialog
        id="portmap-modal"
        visible={this.props.portmapModal.visible}
        title={<ModalTitle title="Add Port Mapping" icon="settings_ethernet" />}
        closeOnEsc
        autosizeContent={false}
        onHide={this.props.hidePortmapModal}
      >
        <PortMapForm
          networkType={this.props.networkType}
          onSubmit={this.addPortmapping}
          {...this.props}
        />
      </EnhancedDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    portmapModal: state.portmapModal.portmapModal,
    initialValues: {
      protocol: 'tcp',
      expose_endpoint: true,
      service_port: 0,
    },
  };
}

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'portMapCreate',
  validate,
})(PortMapModel));
