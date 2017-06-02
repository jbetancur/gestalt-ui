import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import { orderBy } from 'lodash';
import CircularActivity from 'components/CircularActivity';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import Sort from 'components/Sort';
import { Button } from 'components/Buttons';

class EnvironmentItem extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    // workspace: PropTypes.object.isRequired,
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

    this.state = { sortKey: 'created.timestamp', order: 'asc' };
  }

  componentDidMount() {
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

    router.push(`/${params.fqon}/hierarchy/${params.workspaceId}/environments/${item.id}`);
    setCurrentEnvironmentContext(item);
  }

  edit(e, environment) {
    e.stopPropagation();

    const { params, router } = this.props;

    router.push(`/${params.fqon}/hierarchy/${params.workspaceId}/environments/${environment.id}/edit`);
  }

  renderCardsContainer() {
    const sortedEnvironments = orderBy(this.props.environments, this.state.sortKey, this.state.order);

    return (
      <div className="flex-row">
        <Sort
          visible={sortedEnvironments.length > 0}
          sortKey={this.state.sortKey}
          order={this.state.order}
          setKey={value => this.setState({ sortKey: value })}
          setOrder={value => this.setState({ order: value })}
        />
        {sortedEnvironments.map(this.renderCards, this)}
      </div>
    );
  }

  renderProgress() {
    return <CircularActivity id="environments-progress" />;
  }

  renderCards(item) {
    const { t } = this.props;

    return (
      <Card key={item.id} className="flex-4 flex-xs-12 environment-card" onClick={e => this.navEnvironmentDetails(item, e)} raise typeColor="#f9a825">
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
        <CardActions>
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

  render() {
    return this.props.pending ? this.renderProgress() : this.renderCardsContainer();
  }
}

export default EnvironmentItem;
