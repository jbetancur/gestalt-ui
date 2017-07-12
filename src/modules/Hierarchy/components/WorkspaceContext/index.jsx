import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { Providers } from 'modules/Providers';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { VariablesListing } from 'modules/Variables';
import { Breadcrumbs } from 'modules/ContextManagement';
import { Button, NavUpArrowButton } from 'components/Buttons';
import { DeleteIcon, ProviderIcon } from 'components/Icons';
import DotActivity from 'components/DotActivity';
import { getParentFQON } from 'util/helpers/strings';
import Environments from '../../containers/EnvironmentListing';

const CreateButtonSpan = styled.span`
  position: absolute;
  right: 4em;
  top: .5em;

  @media screen and (max-width: 768px) {
    position: relative;
    text-align: right;
    left: .8em;
    top: 0;
    margin-top: -1em;
  }
`;

class WorkspaceContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleWorkspaceNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    deleteWorkspace: PropTypes.func.isRequired,
    workspace: PropTypes.object.isRequired,
    workspacePending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchWorkspace, match } = this.props;

    fetchWorkspace(match.params.fqon, match.params.workspaceId);
  }

  handleViewState(view, index) {
    const { handleWorkspaceNavigation } = this.props;

    handleWorkspaceNavigation(view, index);
  }

  delete() {
    const { match, history, workspace, deleteWorkspace } = this.props;

    const onSuccess = () => history.replace(`/${match.params.fqon}/hierarchy`);
    this.props.confirmDelete(() => {
      deleteWorkspace(match.params.fqon, workspace.id, onSuccess);
    }, workspace.description || workspace.name, 'Workspace');
  }

  renderActionsMenu() {
    const { workspace, workspacePending, match } = this.props;
    const name = workspace.description || workspace.name;

    return (
      <div>
        <MenuButton
          id="workspaces-settings-menu"
          icon
          position={MenuButton.Positions.TOP_LEFT}
          disabled={workspacePending}
          buttonChildren="more_vert"
          tooltipLabel="Actions"
          tooltipPosition="bottom"
        >
          <ListItem
            id="workspaces-settings-menu--create"
            primaryText="Create Environment"
            leftIcon={<FontIcon>create_new_folder</FontIcon>}
            component={Link}
            to={`/${match.params.fqon}/hierarchy/${workspace.id}/createEnvironment`}
          />
          <ListItem
            id="workspaces-settings-menu--edit"
            primaryText={<span>Edit {name} Workspace</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            to={`/${match.params.fqon}/hierarchy/${workspace.id}/editWorkspace`}
          />
          <ListItem
            id="workspaces-settings-menu--entitlements"
            primaryText={<span>Entitlements {name}</span>}
            leftIcon={<FontIcon>security</FontIcon>}
            onClick={() => this.props.showEntitlementsModal(name, match.params, 'Workspace')}
          />
          <Divider />
          <ListItem
            id="workspaces-settings-menu--delete"
            primaryText={<span>Delete {name} Workspace</span>}
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
      default:
        return <div />;
    }
  }

  render() {
    const { workspacePending, history, workspace, match, navigation } = this.props;
    const parentFQON = getParentFQON(workspace);

    return (
      <div>
        <DetailCard expanderTooltipLabel="Details">
          <DetailCardTitle expander={!workspacePending}>
            <NavUpArrowButton disabled={workspacePending} onClick={() => history.push(`/${parentFQON}/hierarchy`)} />
            {this.renderActionsMenu()}
            <div>
              <div className="gf-headline">{!workspacePending ? workspace.description || workspace.name : <DotActivity />}</div>
              <div className="md-caption"><Breadcrumbs /></div>
            </div>
          </DetailCardTitle>
          <CreateButtonSpan>
            <Button
              id="create-environment"
              icon
              primary
              component={Link}
              tooltipLabel="Create Environment"
              tooltipPosition="left"
              to={`/${match.params.fqon}/hierarchy/${workspace.id}/createEnvironment`}
            >
              create_new_folder
            </Button>
          </CreateButtonSpan>
          <DetailCardText expandable>
            <div className="flex-row">
              <div className="flex-6 flex-xs-12">
                <div><span className="gf-label">Name: </span><span className="gf-subtitle">{workspace.description || workspace.name}</span></div>
                <div><span className="gf-label">short-name: </span><span className="gf-subtitle">{workspace.name}</span></div>
                <div><span className="gf-label">Created: </span><span className="gf-subtitle"><FormattedRelative value={workspace.created.timestamp} /> (<FormattedDate value={workspace.created.timestamp} /> <FormattedTime value={workspace.created.timestamp} />)</span></div>
                <div><span className="gf-label">Modified: </span><span className="gf-subtitle"><FormattedRelative value={workspace.modified.timestamp} /> (<FormattedDate value={workspace.modified.timestamp} /> <FormattedTime value={workspace.modified.timestamp} />)</span></div>
                <div><span className="gf-label">Owner: </span><span className="gf-subtitle">{workspace.owner.name}</span></div>
                <div><span className="gf-label">uuid: </span><span className="gf-subtitle">{workspace.id}</span></div>
              </div>
              <div className="flex-6 flex-xs-12">
                <fieldset>
                  <legend>Variables</legend>
                  <VariablesListing envMap={workspace.properties.env} />
                </fieldset>
              </div>
            </div>
          </DetailCardText>
          <TabsContainer defaultTabIndex={navigation.index}>
            <Tabs tabId="workspace-app-tabs">
              <Tab label="Environments" id="environments" icon={<FontIcon>folder</FontIcon>} onClick={() => this.handleViewState('environments', 0)} />
              <Tab label="Providers" id="providers" icon={<ProviderIcon />} onClick={() => this.handleViewState('providers', 1)} />
            </Tabs>
          </TabsContainer>
        </DetailCard>

        <div>
          {this.renderThings(navigation.view)}
        </div>
      </div>
    );
  }
}

export default WorkspaceContext;
