import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import cookie from 'react-cookie';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import Environments from 'modules/Environments';
import Providers from 'modules/Providers';
import Entitlements from 'modules/Entitlements';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { VariablesListing } from 'modules/Variables';
import Breadcrumbs from 'modules/Breadcrumbs';
import { DeleteIcon } from 'components/Icons';

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
    confirmDelete: PropTypes.func.isRequired,
    setCurrentWorkspaceContext: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
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

  handleViewState(view, index) {
    const { handleNavigation, router } = this.props;
    const validCookie = !!cookie.load('auth-token') || false;

    if (!validCookie) {
      router.replace('login');
    }

    handleNavigation(view, index);
  }

  delete() {
    const { params, router, workspace, deleteWorkspace } = this.props;

    const onSuccess = () => router.push(`${params.fqon}/workspaces`);
    this.props.confirmDelete(() => {
      deleteWorkspace(params.fqon, workspace.id, onSuccess);
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
            id="workspaces-settings-menu--edit"
            primaryText={<span>Edit {workspace.description || workspace.name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            to={{
              pathname: `/${params.fqon}/workspaces/${workspace.id}/edit`
            }}
          />
          <Divider />
          <ListItem
            id="workspaces-settings-menu--delete"
            primaryText={<span>Delete {workspace.description || workspace.name}</span>}
            leftIcon={<DeleteIcon />}
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
            {this.renderActionsMenu()}
            <div>
              <div className="gf-headline">{workspace.description || workspace.name}</div>
              <div className="md-caption"><Breadcrumbs /></div>
            </div>
          </DetailCardTitle>
          <div style={{ textAlign: 'right' }}>
            <Button
              id="create-environment"
              key="create-environment--button"
              label="Create Environment"
              flat
              primary
              component={Link}
              to={{
                pathname: `/${params.fqon}/workspaces/${workspace.id}/createEnvironment`,
              }}
            >
              add
            </Button>
          </div>
          <DetailCardText expandable>
            <div><span className="gf-label">Name: </span><span className="gf-subtitle">{workspace.description || workspace.name}</span></div>
            <div><span className="gf-label">short-name: </span><span className="gf-subtitle">{workspace.name}</span></div>
            <div><span className="gf-label">Created: </span><span className="gf-subtitle"><FormattedRelative value={workspace.created.timestamp} /> (<FormattedDate value={workspace.created.timestamp} /> <FormattedTime value={workspace.created.timestamp} />)</span></div>
            <div><span className="gf-label">Modified: </span><span className="gf-subtitle"><FormattedRelative value={workspace.modified.timestamp} /> (<FormattedDate value={workspace.modified.timestamp} /> <FormattedTime value={workspace.modified.timestamp} />)</span></div>
            <div><span className="gf-label">Owner: </span><span className="gf-subtitle">{workspace.owner.name}</span></div>
            <div><span className="gf-label">uuid: </span><span className="gf-subtitle">{workspace.id}</span></div>
            <div className="flex-row">
              <div className="flex-6 flex-xs-12">
                <VariablesListing envMap={workspace.properties.env} />
              </div>
            </div>
          </DetailCardText>
          <TabsContainer defaultTabIndex={navigation.index}>
            <Tabs tabId="workspace-app-tabs">
              <Tab label="Environments" id="environments" icon={<FontIcon>folder</FontIcon>} onClick={() => this.handleViewState('environments', 0)} />
              <Tab label="Providers" id="providers" icon={<FontIcon>cloud</FontIcon>} onClick={() => this.handleViewState('providers', 1)} />
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
