import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
import TimeAgo from 'react-timeago';
import FontIcon from 'react-md/lib/FontIcons';
import Toolbar from 'react-md/lib/Toolbars';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import IconText from 'components/IconText';
import { Card, CardTitle, CardText } from 'components/GFCard';

class WorkspaceItem extends Component {
  static propTypes = {
    workspaces: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchWorkspaces: PropTypes.func.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchWorkspaces(this.props.router.params.fqon);
  }

  componentWillUnmount() {
    this.props.onUnloadListing();
  }

  editItem(e) {
    e.stopPropagation();
  }

  navWorkspaceDetails(item) {
    this.props.router.push({
      pathname: `/${this.props.params.fqon}/workspaces/${item.id}`,
      state: {
        name: item.name
      }
    });
  }

  renderProgress() {
    return <LinearProgress id="workspaces-progress" />;
  }

  renderMenu() {
    return [
      <Button
        id="create-workspace"
        label="Create"
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
          title={item.name}
          subtitle={
            <div>
              <IconText icon="access_time"><TimeAgo date={item.created.timestamp} /></IconText>
            </div>
          }
        />
        <CardText>
          {item.description}
        </CardText>
      </Card>
    );
  }

  render() {
    const { pending, workspaces } = this.props;

    return (
      <div>
        <Toolbar
          themed
          title={<span>workspaces ({workspaces.length})</span>}
          actions={this.renderMenu()}
        />
        {pending ? this.renderProgress() : this.renderCardsContainer()}
      </div>
    );
  }
}

export default WorkspaceItem;
