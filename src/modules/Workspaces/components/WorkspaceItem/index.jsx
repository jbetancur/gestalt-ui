import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
import { FormattedRelative } from 'react-intl';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Card, CardTitle } from 'components/GFCard';
import { DetailCard, DetailCardTitle } from 'components/DetailCard';
import Breadcrumbs from 'modules/Breadcrumbs';

class WorkspaceItem extends Component {
  static propTypes = {
    workspaces: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchWorkspaces: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    setCurrentWorkspaceContext: PropTypes.func.isRequired,
    unloadWorkspaceContext: PropTypes.func.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchWorkspaces(this.props.params.fqon);
    this.props.unloadWorkspaceContext();
    this.props.unloadEnvironmentContext();
  }

  navWorkspaceDetails(item) {
    const { router, params, setCurrentWorkspaceContext } = this.props;

    router.push(`/${params.fqon}/workspaces/${item.id}`);
    setCurrentWorkspaceContext(item);
  }

  renderProgress() {
    return <LinearProgress id="workspaces-progress" />;
  }

  renderMenu() {
    return [
      <Button
        id="create-workspace"
        key="create-workspace--button"
        label="Create Workspace"
        flat
        primary
        component={Link}
        to={`/${this.props.params.fqon}/workspaces/create`}
      >
        add
      </Button>
    ];
  }

  renderCardsContainer() {
    return (
      <div className="flex-row">
        {this.props.workspaces.map(this.renderCards, this)}
      </div>
    );
  }

  renderCards(item) {
    return (
      <Card key={item.id} className="flex-4 flex-xs-12 workspace-card" onClick={e => this.navWorkspaceDetails(item, e)}>
        <CardTitle
          title={item.description || item.name}
          subtitle={
            <div>
              <div className="gf-caption">owner: {item.owner.name}</div>
              <div className="gf-caption">created <FormattedRelative value={item.created.timestamp} /></div>
              <div className="gf-caption">modified <FormattedRelative value={item.modified.timestamp} /></div>
            </div>
          }
        />
      </Card>
    );
  }

  render() {
    const { pending } = this.props;

    return (
      <div>
        <DetailCard>
          <DetailCardTitle className="flex-row">
            <span className="gf-headline-1 flex-8 flex-xs-12" style={{ lineHeight: '2.5em' }}><Breadcrumbs /> / Workspaces</span>
            <span className="flex-4 flex-xs-12" style={{ textAlign: 'right' }}>{this.renderMenu()}</span>
          </DetailCardTitle>
        </DetailCard>
        {pending ? this.renderProgress() : this.renderCardsContainer()}
      </div>
    );
  }
}

export default WorkspaceItem;
