import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import FontIcon from 'react-md/lib/FontIcons';
import { Providers } from 'modules/Providers';
import { DetailCard } from 'components/DetailCard';
import { ProviderIcon } from 'components/Icons';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import Environments from '../../containers/EnvironmentListing';
import WorkspaceActions from '../../components/WorkspaceActions';
import WorkspaceDetails from '../../components/WorkspaceDetails';

class WorkspaceContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    handleWorkspaceNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchWorkspace: PropTypes.func.isRequired,
    workspace: PropTypes.object.isRequired,
    workspacePending: PropTypes.bool.isRequired,
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
    const { workspace, workspacePending, navigation } = this.props;

    return (
      <div>
        <ContextNavigation
          pending={workspacePending}
          breadcrumbComponent={<Breadcrumbs />}
          actionsComponent={<WorkspaceActions workspace={workspace} pending={workspacePending} {...this.props} />}
          detailsComponent={<WorkspaceDetails workspace={workspace} pending={workspacePending} {...this.props} />}
        />
        <DetailCard expanderTooltipLabel="Details">
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
