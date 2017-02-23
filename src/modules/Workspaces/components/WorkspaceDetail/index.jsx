import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cookie from 'react-cookie';
import TimeAgo from 'react-timeago';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import Environments from 'modules/Environments';
import Providers from 'modules/Providers';
import Entitlements from 'modules/Entitlements';
import IconText from 'components/IconText';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { BackArrowButton } from 'components/Buttons';
import { VariablesListing } from 'modules/Variables';
import Breadcrumbs from 'modules/Breadcrumbs';

class WorkspaceDetail extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    deleteWorkspace: PropTypes.func.isRequired,
    workspace: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    onUnload: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    setCurrentWorkspaceContext: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { fetchWorkspace, params } = this.props;

    fetchWorkspace(params.fqon, params.workspaceId);
  }

  componentWillReceiveProps(nextProps) {
    const { workspace, setCurrentWorkspaceContext } = this.props;
    // Keep the current Workspace Context Synced
    if (nextProps.workspace !== workspace) {
      setCurrentWorkspaceContext(nextProps.workspace);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  handleViewState(view, index) {
    const { handleNavigation, router } = this.props;
    const validCookie = !!cookie.load('auth-token') || false;

    if (!validCookie) {
      router.replace('login');
    }

    handleNavigation(view, index);
  }

  delete() {
    const { params, workspace, deleteWorkspace } = this.props;

    this.props.confirmDelete(() => {
      deleteWorkspace(params.fqon, workspace.id);
    }, workspace.description || workspace.name);
  }

  renderActionsMenu() {
    const { workspace, pending, params } = this.props;

    return (
      <div>
        <MenuButton
          id="workspaces-settings-menu"
          icon
          position={MenuButton.Positions.TOP_LEFT}
          disabled={pending}
          buttonChildren="more_vert"
        >
          <ListItem
            id="workspaces-settings-menu--create"
            primaryText="Create Environment"
            leftIcon={<FontIcon>add</FontIcon>}
            component={Link}
            to={{
              pathname: `/${params.fqon}/workspaces/${workspace.id}/createEnvironment`,
              state: {
                workspace,
              },
            }}
          />
          <ListItem
            id="workspaces-settings-menu--edit"
            primaryText={<span>Edit {workspace.description || workspace.name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            to={{
              pathname: `/${params.fqon}/workspaces/${workspace.id}/edit`,
              state: {
                workspace,
              },
            }}
          />
          <Divider />
          <ListItem
            id="workspaces-settings-menu--delete"
            primaryText={<span>Delete {workspace.description || workspace.name}</span>}
            leftIcon={<FontIcon style={{ color: 'red' }}>delete_sweep</FontIcon>}
            onClick={e => this.delete(e)}
          />
        </MenuButton>
      </div>
    );
  }

  renderThings(state) {
    switch (state) {
      case 'environments':
        return (
          <Environments {...this.props} />
        );
      case 'providers':
        return (
          <Providers {...this.props} />
        );
      case 'entitlements':
        return (
          <Entitlements {...this.props} />
        );
      default:
        return <div />;
    }
  }

  renderProgress() {
    return <LinearProgress id="workspace-progress" />;
  }

  render() {
    const { pending, workspace, params, navigation } = this.props;

    return (
      <div>
        <DetailCard>
          <DetailCardTitle expander={!pending}>
            <BackArrowButton component={Link} to={`/${params.fqon}/workspaces`} />
            {this.renderActionsMenu()}
            <div>
              <div className="gf-headline">{workspace.description || workspace.name}</div>
              <div className="md-caption"><Breadcrumbs /></div>
            </div>
          </DetailCardTitle>
          <DetailCardText expandable>
            <IconText icon="short_text"><span>{workspace.name}</span></IconText>
            <IconText icon="access_time"><TimeAgo date={workspace.created.timestamp} /></IconText>
            <IconText icon="timelapse"><TimeAgo date={workspace.modified.timestamp} /></IconText>
            <VariablesListing envMap={workspace.properties.env} />
          </DetailCardText>
          <TabsContainer defaultTabIndex={navigation.index}>
            <Tabs tabId="workspace-app-tabs">
              <Tab label="Environments" id="environments" icon={<FontIcon>folder</FontIcon>} onClick={() => this.handleViewState('environments', 0)} />
              <Tab label="Providers" id="providers" icon={<FontIcon>cloud_queue</FontIcon>} onClick={() => this.handleViewState('providers', 1)} />
              <Tab label="Entitlements" id="entitlements" icon={<FontIcon>security</FontIcon>} onClick={() => this.handleViewState('entitlements', 2)} />
            </Tabs>
          </TabsContainer>
          {pending ? this.renderProgress() : null}
        </DetailCard>

        <div>
          {this.renderThings(navigation.view)}
        </div>
      </div>
    );
  }
}

export default WorkspaceDetail;
