import { connect } from 'react-redux';
import { appActions } from 'App';
import { metaActions } from 'modules/MetaResource';
import { translate } from 'react-i18next';
import EnvironmentItem from '../../components/EnvironmentItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    environments: state.metaResource.environments.environments,
    pending: state.metaResource.environments.pending
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(translate()(EnvironmentItem));
