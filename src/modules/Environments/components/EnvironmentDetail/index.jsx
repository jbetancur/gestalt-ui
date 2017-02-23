import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cookie from 'react-cookie';
import TimeAgo from 'react-timeago';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';
import { TabsContainer, Tabs, Tab } from 'react-md/lib/Tabs';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import LambdaIcon from 'components/LambdaIcon';
import Providers from 'modules/Providers';
import Lambdas from 'modules/Lambdas';
import Containers from 'modules/Containers';
import Policies from 'modules/Policies';
import Integrations from 'modules/Integrations';
import Entitlements from 'modules/Entitlements';
import APIs from 'modules/APIs';
import IconText from 'components/IconText';
import { BackArrowButton } from 'components/Buttons';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { VariablesListing } from 'modules/Variables';
import Breadcrumbs from 'modules/Breadcrumbs';

class EnvironmentDetail extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchEnvironment: PropTypes.func.isRequired,
    deleteEnvironment: PropTypes.func.isRequired,
    environment: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    onUnload: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    setCurrentEnvironmentContext: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { params, fetchEnvironment } = this.props;
    fetchEnvironment(params.fqon, params.environmentId);
  }

  componentWillReceiveProps(nextProps) {
    const { environment, setCurrentEnvironmentContext } = this.props;
    // Keep the current Environment Context Synced
    if (nextProps.environment !== environment) {
      setCurrentEnvironmentContext(nextProps.environment);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  handleViewState(view, index) {
    const { handleNavigation, router } = this.props;
    const validCookie = !!cookie.load('auth-token') || false;

    if (!validCookie) {
      router.replace('/login');
    }

    handleNavigation(view, index);
  }

  delete() {
    const { params, environment, deleteEnvironment } = this.props;

    this.props.confirmDelete(() => {
      deleteEnvironment(params.fqon, environment.id, params.workspaceId);
    }, environment.description || environment.name);
  }

  renderActionsMenu() {
    const { params, pending, environment } = this.props;

    return (
      <div>
        <MenuButton
          id="environments-settings-menu"
          icon
          position={MenuButton.Positions.TOP_LEFT}
          disabled={pending}
          buttonChildren="more_vert"
        >
          <ListItem
            id="environments-settings-menu--edit"
            primaryText={<span>Edit {environment.description || environment.name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            to={`/${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/edit`}
          />
          <Divider />
          <ListItem
            id="environments-settings-menu--delete"
            primaryText={<span>Delete {environment.description || environment.name}</span>}
            leftIcon={<FontIcon style={{ color: 'red' }}>delete_sweep</FontIcon>}
            onClick={e => this.delete(e)}
          />
        </MenuButton>
      </div>
    );
  }

  renderThings(state) {
    switch (state) {
      case 'apis':
        return (
          <APIs {...this.props} />
        );
      case 'providers':
        return (
          <Providers {...this.props} />
        );
      case 'lambdas':
        return (
          <Lambdas {...this.props} />
        );
      case 'entitlements':
        return (
          <Entitlements {...this.props} />
        );
      case 'containers':
        return (
          <Containers {...this.props} />
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

  renderProgress() {
    return <LinearProgress id="workspace-progress" />;
  }

  render() {
    const { pending, environment, params, navigation } = this.props;

    return (
      <div>
        <DetailCard>
          <DetailCardTitle expander={!pending}>
            <BackArrowButton component={Link} to={`/${params.fqon}/workspaces/${params.workspaceId}`} />
            {this.renderActionsMenu()}
            <div>
              <div className="gf-headline">{environment.description || environment.name}</div>
              <div className="md-caption"><Breadcrumbs /></div>
            </div>
          </DetailCardTitle>
          <DetailCardText expandable>
            <IconText icon="short_text"><span>{environment.name}</span></IconText>
            <IconText icon="work"><span>{environment.properties.workspace.name}</span></IconText>
            <IconText icon="access_time"><TimeAgo date={environment.created.timestamp} /></IconText>
            <IconText icon="timelapse"><TimeAgo date={environment.modified.timestamp} /></IconText>
            <IconText icon="folder"><span>{environment.properties.environment_type}</span></IconText>
            <div className="flex-row">
              <div className="flex-6 flex-xs-12">
                <VariablesListing envMap={environment.properties.env} />
              </div>
            </div>
          </DetailCardText>
          <TabsContainer themed defaultTabIndex={navigation.index}>
            <Tabs tabId="environment-app-tabs">
              <Tab label="Lambdas" id="lambdas" icon={<LambdaIcon />} onClick={() => this.handleViewState('lambdas', 0)} />
              <Tab label="API" id="apis" icon={<FontIcon>device_hub</FontIcon>} onClick={() => this.handleViewState('apis', 1)} />
              <Tab label="Containers" id="containers" icon={<FontIcon>developer_board</FontIcon>} onClick={() => this.handleViewState('containers', 2)} />
              <Tab label="Policies" id="policies" icon={<FontIcon>verified_user</FontIcon>} onClick={() => this.handleViewState('policies', 3)} />
              <Tab label="Integrations" id="integrations" icon={<FontIcon>share</FontIcon>} onClick={() => this.handleViewState('integrations', 4)} />
              <Tab label="Providers" id="providers" icon={<FontIcon>cloud</FontIcon>} onClick={() => this.handleViewState('providers', 5)} />
              <Tab label="Entitlements" id="entitlements" icon={<FontIcon>security</FontIcon>} onClick={() => this.handleViewState('entitlements', 6)} />
              <Tab id="hidden" style={{ position: 'fixed', left: '-300px', zIndex: -999999 }} />
            </Tabs>
          </TabsContainer>
          {pending ? this.renderProgress() : null}
        </DetailCard>
        {this.renderThings(navigation.view)}
      </div>
    );
  }
}

export default EnvironmentDetail;
