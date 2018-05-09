import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import axios from 'axios';
import { ListItem, MenuButton } from 'react-md';
import { withMetaResource, urlmapper } from 'Modules/MetaResource';
import Div from 'components/Div';

class ActionsMenu extends PureComponent {
  static propTypes = {
    actionList: PropTypes.array,
    pending: PropTypes.bool,
    // unloadActions: PropTypes.func.isRequired,
    style: PropTypes.object,
    toggleActionsModal: PropTypes.func.isRequired,
    listItem: PropTypes.bool,
    model: PropTypes.object.isRequired,
    isChildResource: PropTypes.bool,
    icon: PropTypes.bool,
    onActionComplete: PropTypes.func,
    keyField: PropTypes.string,
    parentKeyField: PropTypes.string,
    fqon: PropTypes.string.isRequired,
  };

  static defaultProps = {
    actionList: [],
    pending: false,
    style: { textAlign: 'left' },
    listItem: false,
    icon: false,
    onActionComplete: () => { },
    keyField: 'id',
    parentKeyField: 'properties.parent.id',
    isChildResource: false,
  };

  setParams() {
    if (this.props.isChildResource) {
      return {
        resource: get(this.props.model, this.props.parentKeyField),
        pid: get(this.props.model, this.props.keyField),
      };
    }

    return { resource: get(this.props.model, this.props.keyField) };
  }

  async fetchContent(action) {
    const url = urlmapper.buildParams(`${this.props.fqon}/actions/${action.id}/ui`, this.setParams());
    const response = await axios.get(url);

    if (action.headless) {
      this.props.onActionComplete();
    } else {
      this.props.toggleActionsModal(response.data, action.full_screen, this.props.onActionComplete);
    }
  }

  renderActions() {
    const { actionList, style } = this.props;

    return (
      actionList.map(action => (
        <ListItem
          key={action.id}
          primaryText={action.name}
          style={style}
          onClick={() => this.fetchContent(action)}
        />))
    );
  }

  render() {
    const { pending, actionList, listItem, icon } = this.props;

    return (
      actionList && actionList.length > 0 ?
        <Div display="inline">
          {!listItem ?
            <MenuButton
              id="provider-actions-menu"
              disabled={pending}
              iconChildren="more_vert"
              flat={!icon}
              label={!icon && 'Actions'}
              icon={icon}
              position={MenuButton.Positions.BELOW}
              simplifiedMenu={false}
              repositionOnScroll={false}
            >
              {this.renderActions()}
            </MenuButton > :
            this.renderActions()}
        </Div> : null
    );
  }
}

const mapDispatchToProps = dispatch => ({
  toggleActionsModal: (body, isFullScreen, onComplete) => {
    dispatch({ type: 'SHOW_MODAL', modalType: 'IFRAME', modalProps: { body, isFullScreen, onComplete } });
  }
});

export default compose(
  withMetaResource,
  connect(null, mapDispatchToProps),
)(ActionsMenu);
