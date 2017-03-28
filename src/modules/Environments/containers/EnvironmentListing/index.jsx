import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import { sortBy } from 'lodash';
import EnvironmentItem from '../../components/EnvironmentItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    environments: sortBy(state.metaResource.environments.environments, ['created.timestamp', 'description', 'name']),
    pending: state.metaResource.environments.pending
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(EnvironmentItem);
