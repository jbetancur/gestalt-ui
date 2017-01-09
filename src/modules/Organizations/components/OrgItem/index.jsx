import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import TimeAgo from 'react-timeago';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import { BackArrowButton } from 'components/Buttons';
import IconText from 'components/IconText';
import { Card, CardTitle, CardText } from 'components/GFCard';
import { DetailCard, DetailCardTitle, DetailCardText } from 'components/DetailCard';
import { VariablesListing } from 'modules/Variables';
import getParentFQON from 'util/helpers/fqon';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

class OrgItem extends Component {
  static propTypes = {
    organizations: PropTypes.array.isRequired,
    organization: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    deleteOrg: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    currentOrgPending: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { visible: false };
  }

  componentWillMount() {
    this.props.fetchOrgSet(this.props.params.fqon);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.fqon !== this.props.params.fqon) {
      this.props.fetchOrgSet(nextProps.params.fqon);
    }
  }

  navToSubOrgs(item) {
    this.props.router.push(`/${item.properties.fqon}/organizations`);
  }

  delete() {
    const { organization, deleteOrg } = this.props;
    const parentFQON = getParentFQON(organization);
    deleteOrg(organization.properties.fqon, parentFQON);
  }

  renderActionsMenu() {
    const { params, pending, organization, self } = this.props;

    return (
      <div>
        <MenuButton
          id="orgs-settings-menu"
          icon
          position="tl"
          disabled={pending}
          buttonChildren="more_vert"
        >
          <ListItem
            id="orgs-settings-menu--create"
            primaryText={<span>Create Sub-Organization</span>}
            leftIcon={<FontIcon>add</FontIcon>}
            component={Link}
            to={`/${params.fqon}/organizations/create`}
          />
          <ListItem
            id="orgs-settings-menu--edit"
            primaryText={<span>Edit {organization.name}</span>}
            leftIcon={<FontIcon>edit</FontIcon>}
            component={Link}
            to={`/${params.fqon}/organizations/edit`}
          />
          <Divider />
          <ListItem
            id="orgs-settings-menu--delete"
            primaryText={<span>Delete {organization.name}</span>}
            leftIcon={<FontIcon>delete_sweep</FontIcon>}
            disabled={params.fqon === self.properties.gestalt_home || params.fqon === 'root'}
            onClick={e => this.delete(e)}
          />
        </MenuButton>
      </div>
    );
  }

  renderCards(item) {
    return (
      <Card key={item.id} className="flex-4" onClick={() => this.navToSubOrgs(item)}>
        <CardTitle
          title={item.name}
          subtitle={
            <div>
              <div>{item.properties.fqon}</div>
              <IconText icon="access_time"><TimeAgo date={item.created.timestamp} /></IconText>
            </div>}
        />
        <CardText>
          {item.description}
        </CardText>
      </Card>
    );
  }

  renderCardsContainer() {
    return (
      <div className="flex-row">
        {this.props.organizations.map(this.renderCards, this)}
      </div>
    );
  }

  renderProgress() {
    return <LinearProgress id="orgs-progress" />;
  }

  render() {
    const parentFQON = getParentFQON(this.props.organization);
    const { pending, currentOrgPending, organization, self, params } = this.props;

    return (
      <div>
        <DetailCard>
          <DetailCardTitle expander={!this.props.pending} title={params.fqon === self.properties.gestalt_home ? null : <BackArrowButton component={Link} to={`/${parentFQON}/organizations`} />}>
            {this.renderActionsMenu()}
            {pending ? null :
            <div className="gf-headline">{organization.name}
              <div className="md-caption">{organization.properties.fqon}</div>
            </div>
            }
          </DetailCardTitle>
          <DetailCardText expandable>
            <IconText icon="access_time"><TimeAgo date={organization.created.timestamp} /></IconText>
            <IconText icon="timelapse"><TimeAgo date={organization.modified.timestamp} /></IconText>
            <IconText icon="subtitles"><div className="md-body-1">{organization.description}</div></IconText>
            <VariablesListing envMap={organization.properties.env} />
          </DetailCardText>
          {pending || currentOrgPending ? this.renderProgress() : null}
        </DetailCard>
        {pending ? null : this.renderCardsContainer()}
      </div>
    );
  }
}

export default OrgItem;
