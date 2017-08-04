import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'react-md/lib/FontIcons';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import { LambdaIcon, ProviderIcon } from 'components/Icons';
import { Providers } from 'modules/Providers';
import { Lambdas } from 'modules/Lambdas';
import { Containers } from 'modules/Containers';
import { Policies } from 'modules/Policies';
import Integrations from 'modules/Integrations';
import { APIs } from 'modules/APIs';
import { DetailCard } from 'components/DetailCard';
import { Breadcrumbs, ContextNavigation } from 'modules/ContextManagement';
import EnvironmentActions from '../../components/EnvironmentActions';
import EnvironmentDetails from '../../components/EnvironmentDetails';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    handleEnvironmentNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    environment: PropTypes.object.isRequired,
    environmentPending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, fetchEnvironment } = this.props;
    fetchEnvironment(match.params.fqon, match.params.environmentId);
  }

  handleViewState(view, index) {
    const { handleEnvironmentNavigation } = this.props;

    handleEnvironmentNavigation(view, index);
  }

  renderThings(state) {
    switch (state) {
      case 'containers':
        return (
          <Containers {...this.props} />
        );
      case 'apis':
        return (
          <APIs {...this.props} />
        );
      case 'lambdas':
        return (
          <Lambdas {...this.props} />
        );
      case 'providers':
        return (
          <Providers {...this.props} />
        );
      case 'policies':
        return (
          <Policies {...this.props} />
        );
      case 'integrations':
        return (
          <Integrations {...this.props} />
        );
      default:
        return <div />;
    }
  }

  render() {
    const { environmentPending, environment, navigation } = this.props;

    return (
      <div>
        <ContextNavigation
          pending={environmentPending}
          breadcrumbComponent={<Breadcrumbs />}
          actionsComponent={<EnvironmentActions environment={environment} pending={environmentPending} {...this.props} />}
          detailsComponent={<EnvironmentDetails workspace={environment} pending={environmentPending} {...this.props} />}
        />
        <DetailCard expanderTooltipLabel="Details">
          <TabsContainer themed defaultTabIndex={navigation.index}>
            <Tabs tabId="environment-app-tabs">
              <Tab label="Containers" id="containers" icon={<FontIcon>developer_board</FontIcon>} onClick={() => this.handleViewState('containers', 0)} />
              <Tab label="Lambdas" id="lambdas" icon={<LambdaIcon />} onClick={() => this.handleViewState('lambdas', 1)} />
              <Tab label="APIS" id="apis" icon={<FontIcon>device_hub</FontIcon>} onClick={() => this.handleViewState('apis', 2)} />
              <Tab label="Policies" id="policies" icon={<FontIcon>verified_user</FontIcon>} onClick={() => this.handleViewState('policies', 3)} />
              <Tab label="Providers" id="providers" icon={<ProviderIcon />} onClick={() => this.handleViewState('providers', 4)} />
              { /* <Tab label="Integrations" id="integrations" icon={<FontIcon>share</FontIcon>} onClick={() => this.handleViewState('integrations', 5)} /> */}
              <Tab id="hidden" style={{ position: 'fixed', left: '-300px', zIndex: -999999 }} />
            </Tabs>
            {/* Hack above for hiding ugly sliders on react-md tab component when no tab is selected */}
          </TabsContainer>
        </DetailCard>
        {this.renderThings(navigation.view)}
      </div>
    );
  }
}

export default EnvironmentContext;
