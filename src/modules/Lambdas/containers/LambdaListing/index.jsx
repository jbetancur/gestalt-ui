import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { metaActions } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import LambdaItem from '../../components/LambdaItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    lambdas: orderBy(state.metaResource.lambdas.lambdas, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    pending: state.metaResource.lambdas.pending,
    selectedLambdas: state.tableManager.tableSelected,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions, tableActions))(context(LambdaItem));
