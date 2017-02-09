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
import Environments from 'modules/Environments';
import Providers from 'modules/Providers';
import Lambdas from 'modules/Lambdas';
import Containers from 'modules/Containers';
import Policies from 'modules/Policies';
import Integrations from 'modules/Integrations';
import Entitlements from 'modules/Entitlements';
import IconText from 'components/IconText';
import { BackArrowButton } from 'components/Buttons';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { VariablesListing } from 'modules/Variables';

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
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { params, fetchEnvironment } = this.props;
    fetchEnvironment(params.fqon, params.environmentId);
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

    deleteEnvironment(params.fqon, environment.id, params.workspaceId);
  }

  renderActionsMenu() {
    const { params, pending, environment } = this.props;

    return (
      <div>
        <MenuButton
          id="environments-settings-menu"
          icon
          position="tl"
          disabled={pending}
          buttonChildren="more_vert"
        >
          <ListItem
            id="environments-settings-menu--edit"
            primaryText={<span>Edit {environment.name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            to={`/${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/edit`}
          />
          <Divider />
          <ListItem
            id="environments-settings-menu--delete"
            primaryText={<span>Delete {environment.name}</span>}
            leftIcon={<FontIcon>delete_sweep</FontIcon>}
            onClick={e => this.delete(e)}
          />
        </MenuButton>
      </div>
    );
  }


  renderThings(state) {
    const { params } = this.props;
    switch (state) {
      case 'environments':
        return (
          <Environments fqon={params.fqon} workspaceId={params.workspaceId} {...this.props} />
        );
      case 'providers':
        return (
          <Providers fqon={params.fqon} environmentId={params.environmentId} {...this.props} />
        );
      case 'lambdas':
        return (
          <Lambdas fqon={params.fqon} environmentId={params.environmentId} {...this.props} />
        );
      case 'entitlements':
        return (
          <Entitlements fqon={params.fqon} environmentId={params.environmentId} {...this.props} />
        );
      case 'containers':
        return (
          <Containers fqon={params.fqon} environmentId={params.environmentId} {...this.props} />
        );
      case 'policies':
        return (
          <Policies fqon={params.fqon} environmentId={params.environmentId} {...this.props} />
        );
      case 'integrations':
        return (
          <Integrations fqon={params.fqon} environmentId={params.environmentId} {...this.props} />
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
            <div className="gf-headline">{environment.name}</div>
          </DetailCardTitle>
          <DetailCardText expandable>
            <IconText icon="access_time"><TimeAgo date={environment.created.timestamp} /></IconText>
            <IconText icon="timelapse"><TimeAgo date={environment.modified.timestamp} /></IconText>
            <IconText icon="folder">{environment.properties.environment_type}</IconText>
            <IconText icon="subtitles"><div className="md-body-1">{environment.description}</div></IconText>
            <VariablesListing envMap={environment.properties.env} />
          </DetailCardText>
          <TabsContainer themed defaultTabIndex={navigation.index}>
            <Tabs>
              <Tab label="Lambdas" id="lambdas" icon={<LambdaIcon />} onClick={() => this.handleViewState('lambdas', 0)} />
              <Tab label="API" id="apis" icon={<FontIcon>http</FontIcon>} onClick={() => this.handleViewState('apis', 1)} />
              <Tab label="Containers" id="containers" icon={<FontIcon>apps</FontIcon>} onClick={() => this.handleViewState('containers', 2)} />
              <Tab label="Policies" id="policies" icon={<FontIcon>verified_user</FontIcon>} onClick={() => this.handleViewState('policies', 3)} />
              <Tab label="Integrations" id="integrations" icon={<FontIcon>share</FontIcon>} onClick={() => this.handleViewState('integrations', 4)} />
              <Tab label="Providers" id="providers" icon={<FontIcon>cloud_queue</FontIcon>} onClick={() => this.handleViewState('providers', 5)} />
              <Tab label="Entitlements" id="entitlements" icon={<FontIcon>security</FontIcon>} onClick={() => this.handleViewState('entitlements', 6)} />
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
