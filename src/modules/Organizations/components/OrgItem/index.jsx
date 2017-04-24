import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { orderBy } from 'lodash';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import Button from 'react-md/lib/Buttons/Button';
import { NavUpArrowButton } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { VariablesListing } from 'modules/Variables';
import getParentFQON from 'util/helpers/fqon';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { DeleteIcon } from 'components/Icons';
import Sort from 'components/Sort';

class OrgItem extends Component {
  static propTypes = {
    organizations: PropTypes.array.isRequired,
    organization: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    deleteOrg: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    onUnloadOrgSet: PropTypes.func.isRequired,
    setCurrentOrgContext: PropTypes.func.isRequired,
    unloadWorkspaceContext: PropTypes.func.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { sortKey: 'description', order: 'asc' };
  }

  componentDidMount() {
    this.props.fetchOrgSet(this.props.params.fqon);
    this.props.unloadWorkspaceContext();
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.fqon !== this.props.params.fqon) {
      this.props.fetchOrgSet(nextProps.params.fqon);
    }

    // Keep the current Org Context Synced even on refresh
    if (nextProps.organization !== this.props.organization) {
      this.props.setCurrentOrgContext(nextProps.organization);
    }
  }

  componentWillUnmount() {
    /*
      explicitly unload orgs when component is unloaded - normally we do
      this via LOCATION_CHANGE within the reducer, but this presents an issue with side navigation
    */
    this.props.onUnloadOrgSet();
  }

  navToSubOrgs(e, organization) {
    e.stopPropagation();

    const { router, setCurrentOrgContext } = this.props;

    router.push(`/${organization.properties.fqon}/organizations`);
    // Update the current Org Context so we can track the org we are in
    setCurrentOrgContext(organization);
  }

  navToWorkspaces(e, organization) {
    e.stopPropagation();

    const { router, setCurrentOrgContext } = this.props;

    router.push(`${organization.properties.fqon}/workspaces`);
    setCurrentOrgContext(organization);
  }

  edit(e, organization) {
    e.stopPropagation();

    const { router } = this.props;

    router.push(`${organization.properties.fqon}/organizations/edit`);
  }

  delete(e, organization) {
    e.stopPropagation();
    const { deleteOrg } = this.props;
    const parentFQON = getParentFQON(organization);
    const onSuccess = () => this.props.router.replace(`${parentFQON}/organizations`);

    this.props.confirmDelete(() => {
      deleteOrg(organization.properties.fqon, onSuccess);
    }, organization.description || organization.name);
  }

  renderActionsMenu(organization) {
    const { params, pending, self, t } = this.props;

    return (
      <div>
        <MenuButton
          id="orgs-settings-menu"
          icon
          position="tl"
          disabled={pending}
          buttonChildren="more_vert"
          onClick={e => e.stopPropagation()}
        >
          <ListItem
            id="orgs-settings-menu--create"
            primaryText={<span>{t('organizations.actions.createSubOrg')}</span>}
            leftIcon={<FontIcon>add</FontIcon>}
            component={Link}
            onClick={e => e.stopPropagation()}
            to={`/${organization.properties.fqon}/organizations/create`}
          />
          <ListItem
            id="orgs-settings-menu--edit"
            primaryText={<span>{t('general.verbs.edit')} {organization.description || organization.name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            onClick={e => e.stopPropagation()}
            to={`/${organization.properties.fqon}/organizations/edit`}
          />
          <Divider />
          <ListItem
            id="orgs-settings-menu--delete"
            primaryText={<span>{t('general.verbs.delete')} {organization.description || organization.name}</span>}
            leftIcon={<DeleteIcon />}
            disabled={params.fqon === self.properties.gestalt_home || params.fqon === 'root'}
            onClick={e => this.delete(e, organization)}
          />
        </MenuButton>
      </div>
    );
  }

  renderCards(item) {
    const { t } = this.props;

    return (
      <Card key={item.id} className="flex-4 flex-xs-12" onClick={e => this.navToSubOrgs(e, item)}>
        <CardTitle
          title={item.description || item.name}
          subtitle={
            <div>
              <div>{item.properties.fqon}</div>
              {/* TODO: https://gitlab.com/galacticfog/gestalt-meta/issues/185 */}
              {!item.owner.name ? null : <div className="gf-caption"><span>{t('general.nouns.owner').toLowerCase()}: {item.owner.name}</span></div>}
              <div className="gf-caption">{t('general.verbs.created').toLowerCase()} <FormattedRelative value={item.created.timestamp} /></div>
              <div className="gf-caption">{t('general.verbs.modified').toLowerCase()} <FormattedRelative value={item.modified.timestamp} /></div>
            </div>}
        />
        <CardActions>
          <Button
            tooltipLabel={t('organizations.title')}
            icon
            onClick={e => this.navToSubOrgs(e, item)}
          >
            domain
          </Button>
          <Button
            tooltipLabel={t('workspaces.title')}
            icon
            onClick={e => this.navToWorkspaces(e, item)}
          >
            work
          </Button>
          <Button
            tooltipLabel={t('general.verbs.edit')}
            icon
            onClick={e => this.edit(e, item)}
          >
            edit
          </Button>
        </CardActions>
      </Card>
    );
  }

  renderCardsContainer() {
    const sortedOrgs = orderBy(this.props.organizations, this.state.sortKey, this.state.order);

    return (
      <div className="flex-row">
        <Sort
          visible={sortedOrgs.length}
          sortKey={this.state.sortKey}
          order={this.state.order}
          setKey={value => this.setState({ sortKey: value })}
          setOrder={value => this.setState({ order: value })}
        />
        {sortedOrgs.map(this.renderCards, this)}
      </div>
    );
  }

  renderProgress() {
    return <LinearProgress id="orgs-progress" />;
  }

  render() {
    const parentFQON = getParentFQON(this.props.organization);
    const { pending, organization, self, params, t } = this.props;

    return (
      <div>
        <DetailCard>
          <DetailCardTitle expander={!pending} title={params.fqon === self.properties.gestalt_home.properties.fqon ? null : <NavUpArrowButton component={Link} to={`/${parentFQON}/organizations`} />}>
            {this.renderActionsMenu(organization)}
            {!pending ?
              <div className="gf-headline">{organization.description || organization.name}</div> : null}
          </DetailCardTitle>
          <DetailCardText expandable>
            <div className="flex-row">
              <div className="flex-6 flex-xs-12">
                <div><span className="gf-label">{t('general.nouns.name')}: </span><span className="gf-subtitle">{organization.description || organization.name}</span></div>
                <div><span className="gf-label">{t('general.nouns.shortName')}: </span><span className="gf-subtitle">{organization.name}</span></div>
                <div><span className="gf-label">{t('general.nouns.fqon')}: </span><span className="gf-subtitle">{organization.properties.fqon}</span></div>
                <div><span className="gf-label">{t('general.verbs.created')}: </span><span className="gf-subtitle"><FormattedRelative value={organization.created.timestamp} /> (<FormattedDate value={organization.created.timestamp} /> <FormattedTime value={organization.created.timestamp} />)</span></div>
                <div><span className="gf-label">{t('general.verbs.modified')}: </span><span className="gf-subtitle"><FormattedRelative value={organization.modified.timestamp} /> (<FormattedDate value={organization.modified.timestamp} /> <FormattedTime value={organization.modified.timestamp} />)</span></div>
                {/* TODO: https://gitlab.com/galacticfog/gestalt-meta/issues/185 */}
                {!organization.owner.name ? null : <div><span className="gf-label">Owner: </span><span className="gf-subtitle">{organization.owner.name}</span></div>}
                <div><span className="gf-label">{t('general.nouns.uuid')}: </span><span className="gf-subtitle">{organization.id}</span></div>
              </div>
              <div className="flex-6 flex-xs-12">
                <VariablesListing envMap={organization.properties.env} />
              </div>
            </div>
          </DetailCardText>
          {pending ? this.renderProgress() : null}
        </DetailCard>
        {pending ? null : this.renderCardsContainer()}
      </div>
    );
  }
}

export default OrgItem;
