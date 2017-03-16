import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { appActions } from 'App';
import { sortBy } from 'lodash';
import OrgItem from '../../components/OrgItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    // TODO: refactor as selector
    self: state.app.self.self,
    pending: state.organizations.fetchSet.pending,
    organization: state.organizations.fetchSet.organization,
    organizations: sortBy(state.organizations.fetchSet.organizations, 'name'),
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, appActions))(translate()(OrgItem));
