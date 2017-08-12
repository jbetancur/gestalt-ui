import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import axios from 'axios';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { withMetaResource } from 'modules/MetaResource';
import Div from 'components/Div';
import { API_TIMEOUT } from '../../../constants';

const cookies = new Cookies();

class ActionsMenu extends PureComponent {
  static propTypes = {
    actionList: PropTypes.array,
    actionsPending: PropTypes.bool,
    // unloadActions: PropTypes.func.isRequired,
    style: PropTypes.object,
    toggleActionsModal: PropTypes.func.isRequired,
    listItem: PropTypes.bool,
    resourceUUID: PropTypes.string,
    icon: PropTypes.bool,
  };

  static defaultProps = {
    actionList: [],
    actionsPending: false,
    style: { textAlign: 'left' },
    listItem: false,
    resourceUUID: '',
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
      baseURL: `${action.org.href}/actions/${action.id}/ui?resource=${this.props.resourceUUID}`,
      timeout: API_TIMEOUT,
      headers: {
        Authorization: `Bearer ${tokenId}`,
      }
    });

    this.setState({ actionContentPending: true });

    contentAPI.get().then((response) => {
      this.setState({ actionContentPending: false });
      this.props.toggleActionsModal(action.name, response.data);
    }).catch(() => this.setState({ actionContentPending: false }));
  }

  renderActions() {
    const { actionList, style } = this.props;

    return (
      actionList.map(action => (
        <ListItem
          id={action.id}
          primaryText={action.name}
          style={style}
          onClick={() => this.fetchContent(action)}
        />))
    );
  }

  render() {
    const { actionsPending, actionList, listItem, icon } = this.props;

    return (
      actionList && actionList.length > 0 &&
      <Div display="inline">
        {!listItem ?
          <MenuButton
            id="orgs-actions-menu"
            disabled={actionsPending}
            buttonChildren="more_vert"
            flat={!icon}
            label={!icon && 'Actions'}
            icon={icon}
            position={icon ? MenuButton.Positions.TOP_RIGHT : MenuButton.Positions.BELOW}
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
    toggleActionsModal: (title, body) => {
      dispatch({ type: 'SHOW_MODAL', modalType: 'IFRAME', modalProps: { title, body } });
    }
  };
}

export default withMetaResource(connect(null, mapDispatchToProps)(ActionsMenu));
