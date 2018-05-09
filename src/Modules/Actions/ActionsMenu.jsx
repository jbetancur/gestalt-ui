import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { ListItem, MenuButton } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import Div from 'components/Div';
import queryString from 'query-string';

const buildParams = (baseURL, params) => (params ? `${baseURL}?${queryString.stringify(params)}` : baseURL);

class ActionsMenu extends PureComponent {
  static propTypes = {
    actionList: PropTypes.array,
    pending: PropTypes.bool,
    // unloadActions: PropTypes.func.isRequired,
    style: PropTypes.object,
    toggleActionsModal: PropTypes.func.isRequired,
    listItem: PropTypes.bool,
    model: PropTypes.object.isRequired,
    instance: PropTypes.bool,
    icon: PropTypes.bool,
    onActionComplete: PropTypes.func,
    keyField: PropTypes.string,
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
    instance: false,
  };

  constructor() {
    super();

    this.state = {
      actionContentPending: false,
    };
  }

  setParams() {
    if (this.props.instance) {
      return {
        resource: this.props.model.properties.parent.id,
        pid: this.props.model[this.props.keyField],
      };
    }

    return { resource: this.props.model[this.props.keyField] };
  }

  async fetchContent(action) {
    const url = buildParams(`${this.props.fqon}/actions/${action.id}/ui`, this.setParams());

    this.setState({ actionContentPending: true });

    try {
      const response = await axios.get(url);
      this.setState({ actionContentPending: false });

      if (action.headless) {
        this.props.onActionComplete();
      } else {
        this.props.toggleActionsModal(response.data, action.full_screen, this.props.onActionComplete);
      }
    } catch (error) {
      this.setState({ actionContentPending: false });
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
              id="orgs-actions-menu"
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
