import React, { Component, PropTypes } from 'react';
import TimeAgo from 'react-timeago';
import IconText from 'components/IconText';
import CircularActivity from 'components/CircularActivity';
import { Card, CardTitle } from 'components/GFCard';

class EnvironmentItem extends Component {
  static propTypes = {
    environments: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { params } = this.props;
    this.init(params.fqon, params.workspaceId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.workspaceId !== this.props.params.workspaceId) {
      this.init(nextProps.params.fqon, nextProps.params.workspaceId);
    }
  }

  componentWillUnmount() {
    this.props.onUnloadListing();
  }

  init(fqon, workspaceId) {
    this.props.fetchEnvironments(fqon, workspaceId);
  }

  navEnvironmentDetails(item) {
    const { params, router } = this.props;

    router.push(`/${params.fqon}/workspaces/${params.workspaceId}/environments/${item.id}`);
  }

  renderCardsContainer() {
    return (
      <div className="flex-row">
        {this.props.environments.map(this.renderCards, this)}
      </div>
    );
  }

  renderProgress() {
    return <CircularActivity id="environments-progress" />;
  }

  renderCards(item) {
    return (
      <Card key={item.id} className="flex-4 flex-xs-12" onClick={e => this.navEnvironmentDetails(item, e)}>
        <CardTitle
          title={item.description || item.name}
          subtitle={
            <div>
              <IconText icon="short_text"><div>{item.name}</div></IconText>
              <IconText icon="work">{React.Children.toArray(item.properties.workspace.name)}</IconText>
              <IconText icon="description">{React.Children.toArray(item.properties.environment_type)}</IconText>
              <IconText icon="access_time"><TimeAgo date={item.created.timestamp} /></IconText>
            </div>
          }
        />
      </Card>
    );
  }

  render() {
    return this.props.pending ? this.renderProgress() : this.renderCardsContainer();
  }
}

export default EnvironmentItem;
