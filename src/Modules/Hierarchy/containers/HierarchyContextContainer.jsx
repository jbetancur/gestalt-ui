import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withContext } from 'Modules/ContextManagement';
import { withMetaResource } from 'Modules/MetaResource';
import { Providers } from 'Modules/Providers';
import { Users } from 'Modules/Users';
import { Groups } from 'Modules/Groups';
// import { MicroModeler } from 'Modules/MicroModeler';
import Div from 'components/Div';
import HierarchyNav from '../components/HierarchyNav';
import HierarchyListing from './HierarchyListing';
import HierarchyHeader from '../components/HierarchyHeader';
import actions from '../actions';

class HierarchyContext extends PureComponent {
  static propTypes = {
    organizationsSet: PropTypes.array,
    organizationSet: PropTypes.object.isRequired,
    workspacesSet: PropTypes.array,
    match: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    fetchEnvironments: PropTypes.func.isRequired,
    organizationSetPending: PropTypes.bool.isRequired,
    onUnloadOrgSet: PropTypes.func.isRequired,
    unloadWorkspaces: PropTypes.func.isRequired,
    unloadEnvironments: PropTypes.func.isRequired,
    contextManagerActions: PropTypes.object.isRequired,
    fetchContextActions: PropTypes.func.isRequired,
    handleNavigation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    unloadNavigation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    organizationsSet: [],
    workspacesSet: [],
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match, fetchOrgSet, fetchContextActions, contextManagerActions } = this.props;
    fetchOrgSet(match.params.fqon);
    fetchContextActions(match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
    contextManagerActions.unloadWorkspaceContext();
    contextManagerActions.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.fqon && nextProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchOrgSet(nextProps.match.params.fqon);
      this.props.fetchContextActions(nextProps.match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
      this.props.unloadNavigation('hierarchy');
      this.props.unloadEnvironments();
    }
  }

  componentWillUnmount() {
    /*
      explicitly unload orgs when component is unloaded - normally we do
      this via LOCATION_CHANGE within the reducer, but this presents an issue with side navigation
    */
    this.props.onUnloadOrgSet();
    this.props.unloadWorkspaces();
    this.props.unloadEnvironments();
  }

  onFetchEnvironments = () => {
    const { match, fetchEnvironments } = this.props;

    fetchEnvironments(match.params.fqon);
  }

  renderThings(state) {
    switch (state) {
      case 'hierarchy':
        return (
          // Setting a key here ensures the state is reset when the organization context changes
          <HierarchyListing
            key={this.props.organizationSet.id}
            onFetchEnvironments={this.onFetchEnvironments}
            onUnloadEnvironments={this.props.unloadEnvironments}
            {...this.props}
          />
        );
      case 'providers':
        return (
          <Providers {...this.props} />
        );
      case 'users':
        return (
          <Users {...this.props} />
        );
      case 'groups':
        return (
          <Groups {...this.props} />
        );
      // case 'micro-modeler':
      //   return (
      //     <MicroModeler {...this.props} />
      //   );
      default:
        return <div />;
    }
  }

  render() {
    const { organizationSet, navigation, handleNavigation, match } = this.props;

    return (
      <Div>
        <HierarchyNav
          navigation={navigation}
          handleNavigation={handleNavigation}
          showOnRootOnly={match.params.fqon === 'root'}
        />
        <Div paddingLeft="5em">
          <HierarchyHeader
            model={organizationSet}
            {...this.props}
          />
          {this.renderThings(navigation.view)}
        </Div>
      </Div>
    );
  }
}

function mapStateToProps(state) {
  return {
    self: state.metaResource.self.self,
    navigation: state.hierarchy.hierarchyContextNavigation,
  };
}

export default connect(mapStateToProps, actions)(withMetaResource(withContext(HierarchyContext)));
