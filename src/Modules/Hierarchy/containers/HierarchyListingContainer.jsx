import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withMetaResource } from 'Modules/MetaResource';
import { orderBy } from 'lodash';
import { Row, Col } from 'react-flexybox';
import ActivityContainer from 'components/ActivityContainer';
import DotActivity from 'components/DotActivity';
import { Button } from 'components/Buttons';
import Sort from '../components/Sort';
import OrganizationCard from '../components/OrganizationCard';
import WorkspaceCard from '../components/WorkspaceCard';
import EnvironmentCard from '../components/EnvironmentCard';

class HierarchyListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    organizationsSet: PropTypes.array,
    organizationSet: PropTypes.object.isRequired,
    workspacesSet: PropTypes.array,
    fetchOrgSet: PropTypes.func.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    environments: PropTypes.array,
    environmentsPending: PropTypes.bool,
    organizationSetPending: PropTypes.bool.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    organizationsSet: [],
    workspacesSet: [],
    environments: [],
    environmentsPending: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'description',
      order: 'asc',
      showEnvironments: false,
    };
  }

  componentDidMount() {
    const { match, fetchOrgSet } = this.props;

    fetchOrgSet(match.params.fqon);
  }

  componentWillReceiveProps(nextProps) {
    const { showEnvironments } = this.state;

    if (nextProps.match.params.fqon && nextProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchOrgSet(nextProps.match.params.fqon);

      if (showEnvironments) {
        this.props.fetchEnvironments(nextProps.match.params.fqon);
      }
    }
  }

  setSortKey = (sortKey) => {
    this.setState({ sortKey });
  }

  setSortOrder = (order) => {
    this.setState({ order });
  }

  toggleEnvironments = () => {
    const { match, fetchEnvironments, unloadEnvironments } = this.props;
    const { showEnvironments } = this.state;

    if (!showEnvironments) {
      this.setState({ showEnvironments: true });
      fetchEnvironments(match.params.fqon);
    } else {
      this.setState({ showEnvironments: false });
      unloadEnvironments();
    }
  }


  renderCard(item) {
    const cardTypes = {
      'Gestalt::Resource::Organization': 'organization',
      'Gestalt::Resource::Workspace': 'workspace',
      'Gestalt::Resource::Environment': 'environment',
    };

    switch (cardTypes[item.resource_type]) {
      case 'organization':
        return <OrganizationCard model={item} {...this.props} />;
      case 'workspace':
        return <WorkspaceCard model={item} {...this.props} />;
      case 'environment':
        return <EnvironmentCard model={item} {...this.props} />;
      default:
        return <OrganizationCard model={item} {...this.props} />;
    }
  }

  render() {
    const { organizationSetPending, organizationsSet, workspacesSet, environmentsPending, environments } = this.props;
    // only show environments that have a workspace parent
    const cardItems = organizationsSet
      .concat(workspacesSet)
      .concat(environments.filter(env => env.properties.workspace));
    const sortedOrgs = orderBy(cardItems, this.state.sortKey, this.state.order);
    const environmentToggleName = this.state.showEnvironments ? 'Hide Environments' : 'Show Environments';

    return (
      organizationSetPending ?
        <ActivityContainer id="hierarchy--progress" /> :
        [
          <Row key={this.props.organizationSet.id} gutter={5} paddingLeft="1em" alignItems="center">
            <Col flex={2} xs={12} sm={6} md={6}>
              <Sort
                visible={sortedOrgs.length > 0}
                sortKey={this.state.sortKey}
                order={this.state.order}
                setKey={this.setSortKey}
                setOrder={this.setSortOrder}
              />
            </Col>
            <Col flex={10} xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
              <Button
                flat
                inkDisabled
                iconChildren="folder"
                primary={this.state.showEnvironments}
                onClick={this.toggleEnvironments}
                disabled={environmentsPending}
                style={{ minWidth: '17em' }}
              >
                {environmentsPending ?
                  <DotActivity
                    size={1.2}
                    id="hierarchy-environments--progress"
                    centered
                  /> :
                  environmentToggleName}
              </Button>
            </Col>
          </Row>,
          <Row key={`${this.props.organizationSet.id}--cards`} gutter={5} minColWidths={315}>
            {sortedOrgs.map(item => (
              <Col key={item.id} flex={3} xs={12}>
                {this.renderCard(item)}
              </Col>
            ))}
          </Row>
        ]
    );
  }
}

export default withMetaResource(HierarchyListing);
