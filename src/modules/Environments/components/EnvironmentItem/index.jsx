import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TimeAgo from 'react-timeago';
import IconText from 'components/IconText';
import CircularActivity from 'components/CircularActivity';
import { Card, CardTitle, CardText } from 'components/GFCard';

class EnvironmentItem extends Component {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    fqon: PropTypes.string.isRequired,
    workspaceId: PropTypes.string.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.init(this.props.fqon, this.props.workspaceId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workspaceId !== this.props.workspaceId) {
      this.init(nextProps.fqon, nextProps.workspaceId);
    }
  }

  init(fqon, workspaceId) {
    this.props.fetchEnvironments(fqon, workspaceId);
  }

  navEnvironmentDetails(item) {
    browserHistory.push(`/${this.props.fqon}/workspaces/${this.props.workspaceId}/environments/${item.id}`);
  }

  renderCardsContainer() {
    return (
      <div className="flex-row">
        {this.props.environments.map(this.renderCards, this)}
      </div>
    );
  }

  renderProgress() {
    return <CircularActivity id="environments-progress" scale={5} centered={true} />;
  }

  renderCards(item) {
    return (
      <Card key={item.id} className="flex-4" onClick={e => this.navEnvironmentDetails(item, e)}>
        <CardTitle
          title={item.name}
          subtitle={
            <div>
              <IconText icon="folder">{React.Children.toArray(item.properties.workspace.name)}</IconText>
              <IconText icon="description">{React.Children.toArray(item.properties.environment_type)}</IconText>
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
    return this.props.pending ? this.renderProgress() : this.renderCardsContainer();
  }
}

export default EnvironmentItem;
