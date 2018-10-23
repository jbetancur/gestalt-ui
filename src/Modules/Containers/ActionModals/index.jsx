import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SCALE from './Modals/Scale';
import MIGRATE from './Modals/Migrate';
import PROMOTE from './Modals/Promote';

const MODAL_COMPONENTS = {
  SCALE,
  MIGRATE,
  PROMOTE,
  /* other modals */
};

class ModalRoot extends Component {
  static propTypes = {
    actionsModal: PropTypes.object.isRequired,
  };

  state = {
    modalVisible: this.props.actionsModal.visible,
  };

  componentDidUpdate(prevProps) {
    const { actionsModal } = this.props;

    /*
     We use setstate here to force the component to unmount within 300ms to prevent animations from breaking,
     and to make sure the modal is fully destroyed
    */
    if (prevProps.actionsModal.visible !== actionsModal.visible && actionsModal.visible) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ modalVisible: actionsModal.visible });
    }

    if (prevProps.actionsModal.visible !== actionsModal.visible && !actionsModal.visible) {
      // eslint-disable-next-line react/no-did-update-set-state
      setTimeout(() => this.setState({ modalVisible: actionsModal.visible }), 300);
    }
  }

  render() {
    const { actionsModal } = this.props;
    const { modalVisible } = this.state;

    if (!actionsModal.modalType || !modalVisible) {
      return null;
    }

    const SpecificModal = MODAL_COMPONENTS[actionsModal.modalType];
    return <SpecificModal visible={actionsModal.visible} {...actionsModal.modalProps} />;
  }
}

const mapStateToProps = ({ containers }) => ({
  actionsModal: containers.actionsModals,
});

export default connect(mapStateToProps)(ModalRoot);
