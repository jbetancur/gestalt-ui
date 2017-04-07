import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import CircularActivity from 'components/CircularActivity';
import { Card, CardTitle } from 'components/GFCard';

class EnvironmentItem extends Component {
  static propTypes = {
    workspace: PropTypes.object.isRequired,
    environments: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    pending: PropTypes.bool.isRequired,
    setCurrentEnvironmentContext: PropTypes.func.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { params } = this.props;
    this.init(params.fqon, params.workspaceId);
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.workspaceId !== this.props.params.workspaceId) {
      this.init(nextProps.params.fqon, nextProps.params.workspaceId);
    }
  }

  componentWillUnmount() {
    this.props.unloadEnvironments();
  }

  init(fqon, workspaceId) {
    this.props.fetchEnvironments(fqon, workspaceId);
  }

  navEnvironmentDetails(item) {
    const { params, router, setCurrentEnvironmentContext } = this.props;

    router.push({
      pathname: `/${params.fqon}/workspaces/${params.workspaceId}/environments/${item.id}`,
      state: { workspace: this.props.workspace },
    });

    setCurrentEnvironmentContext(item);
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
      <Card key={item.id} className="flex-4 flex-xs-12 environment-card" onClick={e => this.navEnvironmentDetails(item, e)}>
        <CardTitle
          title={item.description || item.name}
          subtitle={
            <div>
              <div className="gf-caption"><span>type: {item.properties.environment_type}</span></div>
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
    return this.props.pending ? this.renderProgress() : this.renderCardsContainer();
  }
}

export default EnvironmentItem;
