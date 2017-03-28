import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { appActions } from 'App';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import OrgItem from '../../components/OrgItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    // TODO: refactor as selector
    self: state.metaResource.self.self,
    pending: state.metaResource.organizationSet.pending,
    organization: state.metaResource.organizationSet.organization,
    organizations: sortBy(state.metaResource.organizationSet.organizations, 'name'),
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, appActions))(translate()(OrgItem));
