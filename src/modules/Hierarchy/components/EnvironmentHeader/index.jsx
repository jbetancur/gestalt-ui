import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'react-md/lib/FontIcons';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import { LambdaIcon, ProviderIcon } from 'components/Icons';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import { DetailCard } from 'components/DetailCard';
import EnvironmentActions from '../../components/EnvironmentActions';
import EnvironmentDetails from '../../components/EnvironmentDetails';

const EnvironmentHeader = (props) => {
  const { environment, environmentPending, navigation, contextActions, contextActionsPending } = props;

  const handleViewState = (view, index) => {
    const { handleEnvironmentNavigation } = props;

    handleEnvironmentNavigation(view, index);
  };

  return (
    <div>
      <ContextNavigation
        model={environment}
        pending={environmentPending}
        breadcrumbComponent={<Breadcrumbs />}
        actionsComponent={<EnvironmentActions environment={environment} pending={environmentPending} {...props} />}
        detailsComponent={<EnvironmentDetails workspace={environment} pending={environmentPending} {...props} />}
        actionsList={contextActions}
        actionsPending={contextActionsPending}
      />
      <DetailCard expanderTooltipLabel="Details">
        <TabsContainer themed defaultTabIndex={navigation.index}>
          <Tabs tabId="environment-app-tabs">
            <Tab label="Containers" id="containers" icon={<FontIcon>developer_board</FontIcon>} onClick={() => handleViewState('containers', 0)} />
            <Tab label="Lambdas" id="lambdas" icon={<LambdaIcon />} onClick={() => handleViewState('lambdas', 1)} />
            <Tab label="APIS" id="apis" icon={<FontIcon>device_hub</FontIcon>} onClick={() => handleViewState('apis', 2)} />
            <Tab label="Policies" id="policies" icon={<FontIcon>verified_user</FontIcon>} onClick={() => handleViewState('policies', 3)} />
            <Tab label="Providers" id="providers" icon={<ProviderIcon />} onClick={() => handleViewState('providers', 4)} />
            { /* <Tab label="Integrations" id="integrations" icon={<FontIcon>share</FontIcon>} onClick={() => handleViewState('integrations', 5)} /> */}
            <Tab id="hidden" style={{ position: 'fixed', left: '-300px', zIndex: -999999 }} />
          </Tabs>
          {/* Hack above for hiding ugly sliders on react-md tab component when no tab is selected */}
        </TabsContainer>
      </DetailCard>
    </div>

  );
};

EnvironmentHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  environment: PropTypes.object.isRequired,
  environmentPending: PropTypes.bool.isRequired,
  handleEnvironmentNavigation: PropTypes.func.isRequired,
  contextActions: PropTypes.array.isRequired,
  contextActionsPending: PropTypes.bool.isRequired,
};

export default EnvironmentHeader;
