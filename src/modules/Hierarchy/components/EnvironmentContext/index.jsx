import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cookie from 'react-cookie';
import getParentFQON from 'util/helpers/fqon';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { LambdaIcon, DeleteIcon, ProviderIcon } from 'components/Icons';
import { Providers } from 'modules/Providers';
import { Lambdas } from 'modules/Lambdas';
import { Containers } from 'modules/Containers';
import { Policies } from 'modules/Policies';
import Integrations from 'modules/Integrations';
import { APIs } from 'modules/APIs';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { VariablesListing } from 'modules/Variables';
import { Breadcrumbs } from 'modules/ContextManagement';
import DotActivity from 'components/DotActivity';
import { NavUpArrowButton } from 'components/Buttons';

class EnvironmentContext extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    handleEnvironmentNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    deleteEnvironment: PropTypes.func.isRequired,
    environment: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    showEntitlementsModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, fetchEnvironment } = this.props;
    fetchEnvironment(match.params.fqon, match.params.environmentId);
  }

  handleViewState(view, index) {
    const { handleEnvironmentNavigation, history } = this.props;
    const validCookie = !!cookie.load('auth-token') || false;

    if (!validCookie) {
      history.replace('/login');
    }

    handleEnvironmentNavigation(view, index);
  }

  delete() {
    const { match, history, environment, deleteEnvironment } = this.props;

    const onSuccess = () => history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);
    this.props.confirmDelete(() => {
      deleteEnvironment(match.params.fqon, environment.id, onSuccess);
    }, environment.description || environment.name, 'Environment');
  }

  renderActionsMenu() {
    const { match, pending, environment } = this.props;
    const name = environment.description || environment.name;

    return (
      <div>
        <MenuButton
          id="environments-settings-menu"
          icon
          position={MenuButton.Positions.TOP_LEFT}
          disabled={pending}
          buttonChildren="more_vert"
          tooltipLabel="Actions"
          tooltipPosition="bottom"
        >
          <ListItem
            id="environments-settings-menu--edit"
            primaryText={<span>Edit {name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}/edit`}
          />
          <ListItem
            id="orgs-settings-menu--entitlements"
            primaryText={<span>Entitlements {name}</span>}
            leftIcon={<FontIcon>security</FontIcon>}
            onClick={() => this.props.showEntitlementsModal(name, match.params, 'Environment')}
          />
          <Divider />
          <ListItem
            id="environments-settings-menu--delete"
            primaryText={<span>Delete {name}</span>}
            leftIcon={<DeleteIcon />}
            onClick={e => this.delete(e)}
          />
        </MenuButton>
      </div>
    );
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
    const { match, history, pending, environment, navigation } = this.props;
    const parentFQON = getParentFQON(environment);
    const name = environment.description || environment.name;

    return (
      <div>
        <DetailCard expanderTooltipLabel="Details">
          <DetailCardTitle expander={!pending}>
            <NavUpArrowButton disabled={pending} onClick={() => history.push(`/${parentFQON}/hierarchy/${match.params.workspaceId}`)} />
            {this.renderActionsMenu()}
            <div>
              <div className="gf-headline">{!pending ? name : <DotActivity />}</div>
              <div className="md-caption"><Breadcrumbs /></div>
            </div>
          </DetailCardTitle>
          <DetailCardText expandable>
            <div className="flex-row">
              <div className="flex-6 flex-xs-12">
                <div><span className="gf-label">Name: </span><span className="gf-subtitle">{name}</span></div>
                <div><span className="gf-label">short-name: </span><span className="gf-subtitle">{environment.name}</span></div>
                <div><span className="gf-label">Created: </span><span className="gf-subtitle"><FormattedRelative value={environment.created.timestamp} /> (<FormattedDate value={environment.created.timestamp} /> <FormattedTime value={environment.created.timestamp} />)</span></div>
                <div><span className="gf-label">Modified: </span><span className="gf-subtitle"><FormattedRelative value={environment.modified.timestamp} /> (<FormattedDate value={environment.modified.timestamp} /> <FormattedTime value={environment.modified.timestamp} />)</span></div>
                <div><span className="gf-label">Environment Type: </span><span className="gf-subtitle">{environment.properties.environment_type}</span></div>
                <div><span className="gf-label">Owner: </span><span className="gf-subtitle">{environment.owner.name}</span></div>
                <div><span className="gf-label">uuid: </span><span className="gf-subtitle">{environment.id}</span></div>
              </div>
              <div className="flex-6 flex-xs-12">
                <fieldset>
                  <legend>Variables</legend>
                  <VariablesListing envMap={environment.properties.env} />
                </fieldset>
              </div>
            </div>
          </DetailCardText>
          {/* make sure you edit the navigation reducer initial state index to match # of tabs + 1! */}
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
