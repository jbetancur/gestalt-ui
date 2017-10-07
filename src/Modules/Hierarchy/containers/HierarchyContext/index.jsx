import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withContext } from 'Modules/ContextManagement';
import { metaActions } from 'Modules/MetaResource';
import { Providers } from 'Modules/Providers';
import { Users } from 'Modules/Users';
import { Groups } from 'Modules/Groups';
import Div from 'components/Div';
import HierarchyNav from '../../components/HierarchyNav';
import HierarchyListing from '../HierarchyListing';
import HierarchyHeader from '../../components/HierarchyHeader';
import actions from '../../actions';

class HierarchyContext extends PureComponent {
  static propTypes = {
    organizationsSet: PropTypes.array,
    organizationSet: PropTypes.object.isRequired,
    workspacesSet: PropTypes.array,
    match: PropTypes.object.isRequired,
    fetchOrgSet: PropTypes.func.isRequired,
    orangizationSetPending: PropTypes.bool.isRequired,
    onUnloadOrgSet: PropTypes.func.isRequired,
    unloadWorkspaces: PropTypes.func.isRequired,
    unloadWorkspaceContext: PropTypes.func.isRequired,
    unloadEnvironmentContext: PropTypes.func.isRequired,
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
    const { match } = this.props;
    this.props.fetchOrgSet(match.params.fqon);
    this.props.fetchContextActions(match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
    this.props.unloadWorkspaceContext();
    this.props.unloadEnvironmentContext();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.fqon !== this.props.match.params.fqon) {
      this.props.fetchOrgSet(nextProps.match.params.fqon);
      this.props.fetchContextActions(nextProps.match.params.fqon, null, null, { filter: ['org.detail', 'org.list'] });
      this.props.unloadNavigation('hierarchy');
    }
  }

  componentWillUnmount() {
    /*
      explicitly unload orgs when component is unloaded - normally we do
      this via LOCATION_CHANGE within the reducer, but this presents an issue with side navigation
    */
    this.props.onUnloadOrgSet();
    this.props.unloadWorkspaces();
  }

  renderThings(state) {
    switch (state) {
      case 'hierarchy':
        return (
          <HierarchyListing {...this.props} />
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
          showUsersGroups={match.params.fqon === 'root'}
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

const bindActions = Object.assign({}, actions, metaActions);

export default connect(mapStateToProps, bindActions)(withContext(HierarchyContext));
