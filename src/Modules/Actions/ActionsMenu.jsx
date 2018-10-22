import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { ListItem, MenuButton } from 'react-md';
import Div from 'components/Div';

class ActionsMenu extends PureComponent {
  static propTypes = {
    actionList: PropTypes.array,
    style: PropTypes.object,
    toggleActionsModal: PropTypes.func.isRequired,
    listItem: PropTypes.bool,
    icon: PropTypes.bool,
    onActionComplete: PropTypes.func,
  };

  static defaultProps = {
    actionList: [],
    style: { textAlign: 'left' },
    listItem: false,
    icon: false,
    onActionComplete: () => { },
  };

  async fetchContent(action) {
    const { onActionComplete, toggleActionsModal } = this.props;

    const verb = action.method
      ? action.method.toLowerCase()
      : 'get';

    const response = await axios[verb](action.url);

    if (action.render !== 'none') {
      toggleActionsModal(response.data, false, onActionComplete);
    }
  }

  renderActions() {
    const { actionList, style } = this.props;

    return (
      actionList.map((action, index) => {
        const actionName = action.display_name || action.name;

        return (
          <ListItem
            key={`${actionName}-${index}`}
            primaryText={actionName}
            style={style}
            onClick={() => this.fetchContent(action)}
          />
        );
      })
    );
  }

  render() {
    const { actionList, listItem, icon } = this.props;
    return (
      actionList && actionList.length > 0 ?
        <Div display="inline">
          {!listItem ?
            <MenuButton
              id="provider-actions-menu"
              iconChildren={icon ? 'more_vert' : 'arrow_drop_down'}
              flat={!icon}
              icon={icon}
              iconBefore={false}
              position={MenuButton.Positions.BELOW}
              simplifiedMenu={false}
              repositionOnScroll={false}
              menuItems={this.renderActions()}
            >
              {!icon && 'Actions'}
            </MenuButton> :
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
  connect(null, mapDispatchToProps),
)(ActionsMenu);
