import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import axios from 'axios';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Div from 'components/Div';
import { buildParams } from 'config/lib/urlmapper';
// import { arrayToMap } from 'util/helpers/transformations';

class ActionsMenu extends PureComponent {
  static propTypes = {
    actionList: PropTypes.array,
    style: PropTypes.object,
    toggleActionsModal: PropTypes.func,
    listItem: PropTypes.bool,
    icon: PropTypes.bool,
    resource: PropTypes.object,
    onActionComplete: PropTypes.func,
  };

  static defaultProps = {
    actionList: [],
    style: { textAlign: 'left' },
    listItem: false,
    icon: false,
    resource: {},
    onActionComplete: () => { },
    toggleActionsModal: () => { }

  };

  parseURL(url, params = {}, resource = {}) {
    if (Object.keys(params).length) {
      const mapParams = {};

      Object.keys(params).forEach((key) => {
        mapParams[key] = get(resource, params[key]);
      });

      return buildParams(url, mapParams);
    }

    return url;
  }

  async fetchContent(action) {
    const { onActionComplete, toggleActionsModal, resource } = this.props;

    const verb = action.method
      ? action.method.toLowerCase()
      : 'get';


    const response = await axios[verb](this.parseURL(action.url, action.params, resource));

    if (action.render !== 'none') {
      toggleActionsModal(response.data, false, onActionComplete);
    }
  }

  renderActions() {
    const { actionList, style } = this.props;

    return (
      actionList.map((action, index) => {
        const actionName = action.display_name || action.action;

        return (
          <ListItem
            key={`${actionName}-${index}`}
            button
            style={style}
            onClick={() => this.fetchContent(action)}
          >
            <ListItemText primary={actionName} />
          </ListItem>
        );
      })
    );
  }

  render() {
    const { actionList, listItem, icon, onActionComplete, toggleActionsModal, resource, ...rest } = this.props;

    if (actionList && actionList.length > 0) {
      return (
        <Div display="inline">
          {!listItem ?
            <MenuButton
              id="provider-actions-menu"
              flat={!icon}
              flatColor="info"
              label="Actions"
              iconAfter
              icon={<ArrowDropDownIcon fontSize="small" />}
              {...rest}
            >
              {this.renderActions()}
            </MenuButton> :
            this.renderActions()}
        </Div>
      );
    }

    return null;
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
