import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import styled from 'styled-components';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { DetailCard, DetailCardTitle } from 'components/DetailCard';
import { Button } from 'components/Buttons';
import Breadcrumbs from 'modules/Breadcrumbs';
import Sort from 'components/Sort';

const CreateButtonSpan = styled.span`
  text-align: right;
`;

class WorkspaceItem extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
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

    this.state = { sortKey: 'description', order: 'asc' };
  }

  componentDidMount() {
    this.props.fetchWorkspaces(this.props.params.fqon);
    this.props.unloadWorkspaceContext();
    this.props.unloadEnvironmentContext();
  }

  navWorkspaceDetails(item) {
    const { router, params, setCurrentWorkspaceContext } = this.props;

    router.push(`/${params.fqon}/hierarchy/${item.id}`);
    setCurrentWorkspaceContext(item);
  }

  edit(e, workspace) {
    e.stopPropagation();

    const { params, router } = this.props;

    router.push(`/${params.fqon}/hierarchy/${workspace.id}/edit`);
  }

  renderProgress() {
    return <LinearProgress id="workspaces-progress" />;
  }

  renderCreateButton() {
    return [
      <Button
        id="create-workspace"
        key="create-workspace--button"
        label="Create Workspace"
        flat
        primary
        component={Link}
        to={`/${this.props.params.fqon}/hierarchy/create`}
      >
        add
      </Button>
    ];
  }

  renderCardsContainer() {
    const sortedWorkspaces = orderBy(this.props.workspaces, this.state.sortKey, this.state.order);

    return (
      <div className="flex-row">
        <Sort
          visible={sortedWorkspaces.length > 0}
          sortKey={this.state.sortKey}
          order={this.state.order}
          setKey={value => this.setState({ sortKey: value })}
          setOrder={value => this.setState({ order: value })}
        />
        {sortedWorkspaces.map(this.renderCards, this)}
      </div>
    );
  }

  renderCards(item) {
    const { t } = this.props;

    return (
      <Card key={item.id} className="flex-4 flex-xs-12 workspace-card" onClick={e => this.navWorkspaceDetails(item, e)} raise>
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
    const { pending } = this.props;

    return (
      <div>
        <DetailCard>
          <DetailCardTitle className="flex-row">
            <div className="flex-8 flex-xs-12">
              <div className="gf-headline">Workspaces</div>
              <div className="md-caption"><Breadcrumbs /></div>
            </div>
            <CreateButtonSpan
              className="flex-4 flex-xs-12"
            >
              {this.renderCreateButton()}
            </CreateButtonSpan>
          </DetailCardTitle>
        </DetailCard>
        {pending ? this.renderProgress() : this.renderCardsContainer()}
      </div>
    );
  }
}

export default WorkspaceItem;
