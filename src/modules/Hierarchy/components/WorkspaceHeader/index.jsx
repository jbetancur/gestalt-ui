import React from 'react';
import PropTypes from 'prop-types';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import FontIcon from 'react-md/lib/FontIcons';
import { DetailCard } from 'components/DetailCard';
import { ProviderIcon } from 'components/Icons';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import WorkspaceActions from '../../components/WorkspaceActions';
import WorkspaceDetails from '../../components/WorkspaceDetails';

const WorkspaceHeader = (props) => {
  const { workspace, workspacePending, navigation } = props;

  const handleViewState = (view, index) => {
    const { handleWorkspaceNavigation } = props;

    handleWorkspaceNavigation(view, index);
  };

  return (
    <div>
      <ContextNavigation
        pending={workspacePending}
        breadcrumbComponent={<Breadcrumbs />}
        actionsComponent={<WorkspaceActions workspace={workspace} pending={workspacePending} {...props} />}
        detailsComponent={<WorkspaceDetails workspace={workspace} pending={workspacePending} {...props} />}
      />
      <DetailCard expanderTooltipLabel="Details">
        <TabsContainer defaultTabIndex={navigation.index}>
          <Tabs tabId="workspace-app-tabs">
            <Tab label="Environments" id="environments" icon={<FontIcon>folder</FontIcon>} onClick={() => handleViewState('environments', 0)} />
            <Tab label="Providers" id="providers" icon={<ProviderIcon />} onClick={() => handleViewState('providers', 1)} />
          </Tabs>
        </TabsContainer>
      </DetailCard>
    </div>
  );
};

WorkspaceHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  workspacePending: PropTypes.bool.isRequired,
  handleWorkspaceNavigation: PropTypes.func.isRequired,
};

export default WorkspaceHeader;
