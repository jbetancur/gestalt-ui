import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import PolicyItem from '../../components/PolicyItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    policies: orderBy(state.metaResource.policies.policies, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedPolicies: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(context(PolicyItem)));
