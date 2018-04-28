import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { ListItem, MenuButton } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import Div from 'components/Div';
import { API_URL, API_TIMEOUT } from '../../constants';

const cookies = new Cookies();

class ActionsMenu extends PureComponent {
  static propTypes = {
    actionList: PropTypes.array,
    pending: PropTypes.bool,
    // unloadActions: PropTypes.func.isRequired,
    style: PropTypes.object,
    toggleActionsModal: PropTypes.func.isRequired,
    listItem: PropTypes.bool,
    model: PropTypes.object.isRequired,
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
  };

  constructor() {
    super();

    this.state = {
      actionContentPending: false,
    };
  }

  fetchContent(action) {
    const tokenId = cookies.get('auth_token');
    const url = `${API_URL}/${this.props.fqon}/actions/${action.id}/ui?resource=${this.props.model[this.props.keyField]}`;

    const contentAPI = axios.create({
      baseURL: url,
      timeout: API_TIMEOUT,
      headers: {
        Authorization: `Bearer ${tokenId}`,
      }
    });

    this.setState({ actionContentPending: true });

    contentAPI.get().then((response) => {
      this.setState({ actionContentPending: false });

      if (action.headless) {
        this.props.onActionComplete();
      } else {
        this.props.toggleActionsModal(response.data, action.full_screen, this.props.onActionComplete);
      }
    }).catch(() => this.setState({ actionContentPending: false }));
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
