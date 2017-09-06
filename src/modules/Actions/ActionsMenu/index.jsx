import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import axios from 'axios';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { withMetaResource } from 'modules/MetaResource';
import Div from 'components/Div';
import { API_URL, API_TIMEOUT } from '../../../constants';

const cookies = new Cookies();

class ActionsMenu extends PureComponent {
  static propTypes = {
    actionList: PropTypes.array,
    pending: PropTypes.bool,
    // unloadActions: PropTypes.func.isRequired,
    style: PropTypes.object,
    toggleActionsModal: PropTypes.func.isRequired,
    listItem: PropTypes.bool,
    model: PropTypes.string.isRequired,
    icon: PropTypes.bool,

  };

  static defaultProps = {
    actionList: [],
    pending: false,
    style: { textAlign: 'left' },
    listItem: false,
    icon: false,
  };

  constructor() {
    super();

    this.state = {
      actionContentPending: false,
    };
  }

  fetchContent(action) {
    const tokenId = cookies.get('auth_token');

    const contentAPI = axios.create({
      baseURL: `${API_URL}/${this.props.model.org.properties.fqon}/actions/${action.id}/ui?resource=${this.props.model.id}`,
      timeout: API_TIMEOUT,
      headers: {
        Authorization: `Bearer ${tokenId}`,
      }
    });

    this.setState({ actionContentPending: true });

    contentAPI.get().then((response) => {
      this.setState({ actionContentPending: false });
      this.props.toggleActionsModal(response.data, action.full_screen);
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
      actionList && actionList.length > 0 &&
      <Div display="inline">
        {!listItem ?
          <MenuButton
            id="orgs-actions-menu"
            disabled={pending}
            buttonChildren="more_vert"
            flat={!icon}
            label={!icon && 'Actions'}
            icon={icon}
            position={icon ? MenuButton.Positions.BOTTOM_LEFT : MenuButton.Positions.BELOW}
            tooltipLabel={icon && 'Actions'}
          >
            {this.renderActions()}
          </MenuButton > :
          this.renderActions()}
      </Div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleActionsModal: (body, isFullScreen) => {
      dispatch({ type: 'SHOW_MODAL', modalType: 'IFRAME', modalProps: { body, isFullScreen } });
    }
  };
}

export default withMetaResource(connect(null, mapDispatchToProps)(ActionsMenu));
