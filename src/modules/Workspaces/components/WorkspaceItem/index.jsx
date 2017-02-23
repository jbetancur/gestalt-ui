import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
import TimeAgo from 'react-timeago';
import FontIcon from 'react-md/lib/FontIcons';
import Toolbar from 'react-md/lib/Toolbars';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import IconText from 'components/IconText';
import { Card, CardTitle } from 'components/GFCard';
import Breadcrumbs from 'modules/Breadcrumbs';

class WorkspaceItem extends Component {
  static propTypes = {
    workspaces: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchWorkspaces: PropTypes.func.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
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

  componentWillUnmount() {
    this.props.onUnloadListing();
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
        label="Create Workspace"
        flat
        component={Link}
        to={`/${this.props.params.fqon}/workspaces/create`}
      >
        <FontIcon>add</FontIcon>
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
      <Card key={item.id} className="flex-4 flex-xs-12" onClick={e => this.navWorkspaceDetails(item, e)}>
        <CardTitle
          title={item.description || item.name}
          subtitle={
            <div>
              <IconText icon="short_text"><div>{item.name}</div></IconText>
              <IconText icon="access_time"><TimeAgo date={item.created.timestamp} /></IconText>
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
        <Toolbar
          themed
          title={<span className="gf-headline-1"><Breadcrumbs /> / Workspaces</span>}
          actions={this.renderMenu()}
        />
        {pending ? this.renderProgress() : this.renderCardsContainer()}
      </div>
    );
  }
}

export default WorkspaceItem;
